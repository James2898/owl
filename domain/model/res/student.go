package res

import "go.mongodb.org/mongo-driver/bson/primitive"

type StudentKeys struct {
	Object []Student `json:"students"`
}

type Student struct {
	ID         primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	LastName   string             `json:"lastName"`
	FirstName  string             `json:"firstName"`
	MiddleName string             `json:"middleName"`
	Suffix     string             `json:"suffix"`
	Contact    string             `json:"contact"`
	ImageUri   string             `json:"imageUri"`
	SectionID  int                `json:"sectionID"`
	Strand     string             `json:"strand"`
	Grade      int                `json:"grade"`
	Comment    string             `json:"comment"`
}
