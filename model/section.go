package model

import "gorm.io/gorm"

type Section struct {
	gorm.Model
	Id int `gorm:"type:int;primary_key"`
	Name string `gorm:"type:varchar(255)"`
	Level_id int `gorm:"type:int"`

	Level Level `gorm:"foreignKey:Level_id"`
}