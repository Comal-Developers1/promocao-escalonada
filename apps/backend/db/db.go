package db

import _ "embed"

//aqui fica as variaveis que tem o sql, siga o formato abaixo.

//go:embed promocao/payment-plan.sql
var PaymentPlanQuery string

//go:embed promocao/products.sql
var ProductsQuery string

//go:embed update/update.sql
var UpdateQuery string
