CREATE or REPLACE VIEW total_balance AS
select tr.operation_date,
CASE
WHEN EXTRACT(DOW FROM tr.operation_date) = 0 THEN 'Вс'
WHEN EXTRACT(DOW FROM tr.operation_date) = 1 THEN 'Пн'
WHEN EXTRACT(DOW FROM tr.operation_date) = 2 THEN 'Вт'
WHEN EXTRACT(DOW FROM tr.operation_date) = 3 THEN 'Ср'
WHEN EXTRACT(DOW FROM tr.operation_date) = 4 THEN 'Чт'
WHEN EXTRACT(DOW FROM tr.operation_date) = 5 THEN 'Пт'
WHEN EXTRACT(DOW FROM tr.operation_date) = 6 THEN 'Сб'
ELSE 'Другое'
END,
       coalesce(sum(sum(tr.operation_summ)) over (order by tr.operation_date
                rows between unbounded preceding and current row),
                0) as total
FROM
  transactionapp_transaction tr
  left join maapp_moneyaccount ma on ma.id = tr.account_id
WHERE
  (
    ma.is_visible isnull
    OR ma.is_visible = true
  )
GROUP BY
  tr.operation_date
order by
  tr.operation_date;


CREATE or REPLACE VIEW total_balance_per_account AS
select tr.operation_date,
CASE
WHEN EXTRACT(DOW FROM tr.operation_date) = 0 THEN 'Вс'
WHEN EXTRACT(DOW FROM tr.operation_date) = 1 THEN 'Пн'
WHEN EXTRACT(DOW FROM tr.operation_date) = 2 THEN 'Вт'
WHEN EXTRACT(DOW FROM tr.operation_date) = 3 THEN 'Ср'
WHEN EXTRACT(DOW FROM tr.operation_date) = 4 THEN 'Чт'
WHEN EXTRACT(DOW FROM tr.operation_date) = 5 THEN 'Пт'
WHEN EXTRACT(DOW FROM tr.operation_date) = 6 THEN 'Сб'
ELSE 'Другое'
END,
tr.account_id,
       coalesce(sum(sum(tr.operation_summ)) over (partition by tr.account_id order by tr.operation_date
                rows between unbounded preceding and current row),
                0) as total
FROM
  transactionapp_transaction tr
where
  (
  NOT (account_id ISNULL)
  AND
  not past
  )
GROUP BY
  tr.operation_date, tr.account_id
order by
  tr.account_id, tr.operation_date;


CREATE
OR REPLACE VIEW ma_info AS
SELECT
  ma.id,
  ma.name,
  COALESCE(SUM(tr.operation_summ), 0) as sum,
  ma.is_visible,
  COUNT(tr.account_id) as count
FROM
  maapp_moneyaccount as ma
  LEFT JOIN transactionapp_transaction as tr on ma.id = tr.account_id
group by
  ma.id
order by
  count DESC;

--CREATE or REPLACE VIEW last_headers AS
--select distinct on (header) * from (
--select distinct on (tr.header_id, tr.operation_date)
--	h.name as header,
--	cat.name as category,
--	subcat.name as subcategory
--from transactionapp_transaction as tr
--JOIN budget_header as h on h.id = tr.header_id
--JOIN budget_subcategory as subcat on subcat.id = tr.subcategory_id
--JOIN budget_category as cat on cat.id = tr.category_id
--WHERE tr.past = false
--order by tr.header_id, tr.operation_date DESC) as foo
--order by header;

ALTER TABLE public.transactionapp_transaction DROP CONSTRAINT transactionapp_trans_plain_id_id_2a5abb34_fk_transacti;
ALTER TABLE public.transactionapp_transaction ADD CONSTRAINT transactionapp_trans_plain_id_id_2a5abb34_fk_transacti FOREIGN KEY (plain_id_id) REFERENCES public.transactionapp_plainoperation(id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

CREATE
OR REPLACE VIEW headers_rating AS
SELECT
  bh.id,
  bh.name,
  COUNT(tr.header_id) AS count
FROM
  budget_header AS bh
  LEFT JOIN transactionapp_transaction AS tr ON bh.id = tr.header_id
WHERE 
  NOT tr.past AND tr.operation_summ < 0
GROUP BY
  bh.id
ORDER  BY
  count DESC
LIMIT 10
