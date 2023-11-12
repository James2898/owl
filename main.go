package main

import (
	"owl/config"
	"owl/model"

	"github.com/rs/zerolog/log"
)

func main() {
	log.Info().Msg("Started Server!")
	db := config.DatabaseConnection()

	db.Table("level").AutoMigrate(&model.Level{})
}