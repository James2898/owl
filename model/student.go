package model

import "gorm.io/gorm"

type Student struct {
	gorm.Model
	Id    int    `gorm:"type:int;primary_key"`
	Lname string `gorm:"type:varchar(255)"`
	Fname string `gorm:"type:varchar(255)"`
	Mname string `gorm:"type:varchar(255)"`
	Lrn   string `gorm:"type:varchar(255)"`
	Section_no int `gorm:"type:int"`
	Gender string `gorm:"type:varchar(255)"`

	Section Section `gorm:"foreignKey:section_no"`
}