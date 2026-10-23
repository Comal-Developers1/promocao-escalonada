package update

import "context"

type Repository interface {
	UpdatePcDescontoREPO(c context.Context) error
}

type Service interface {
	UpdateManual(c context.Context) error
	InitCronJobsUpdateSVC()
}
