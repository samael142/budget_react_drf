CREATE or REPLACE VIEW total_balance AS
select tr.operation_date,
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
select tr.operation_date, tr.account_id,
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