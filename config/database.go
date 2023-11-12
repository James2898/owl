package config

import (
	"fmt"

	"github.com/rs/zerolog/log"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

const (
	host     = "0.0.0.0"
	port     = 5432
	user     = "root"
	password = "password"
	dbName   = "owl"
)

func DatabaseConnection() *gorm.DB {
	sqlInfo := fmt.Sprintf("host=%s port =%d user=%s password=%s dbname=%s sslmode=disable",host,port,user,password,dbName)
	db, err := gorm.Open(postgres.Open(sqlInfo), &gorm.Config{})

	if (err != nil) {
		log.Info().Msg("ERROR!")
		panic(err)
	}

	return db
}