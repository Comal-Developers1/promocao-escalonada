package utils

import "time"

func FormatarDataWinthor(dataStr string) string {
	t, err := time.Parse("2006-01-02", dataStr)
	if err != nil {
		return dataStr
	}
	return t.Format("02/01/2006")
}