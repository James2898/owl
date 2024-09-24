package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"owl/domain/model/req"
	"owl/domain/model/res"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type XValidator struct {
	validator *validator.Validate
}

type ErrorResponse struct {
	Error       bool
	FailedField string
	Tag         string
	Value       interface{}
}

var studentsCol *mongo.Collection
var validate = validator.New()

func (v XValidator) Validate(data interface{}) []ErrorResponse {
	validationErrors := []ErrorResponse{}

	errs := validate.Struct(data)
	if errs != nil {
		for _, err := range errs.(validator.ValidationErrors) {
			// In this case data object is actually holding the User struct
			var elem ErrorResponse

			elem.FailedField = err.Field() // Export struct field name
			elem.Tag = err.Tag()           // Export struct tag
			elem.Value = err.Value()       // Export field value
			elem.Error = true

			validationErrors = append(validationErrors, elem)
		}
	}

	return validationErrors
}

func main() {
	// LOAD ENV
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file:", err)
	}

	// DB CONNECT
	MONGODB_URI := os.Getenv("MONGODB_URI")
	clientOptions := options.Client().ApplyURI(MONGODB_URI)

	client, err := mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}

	defer client.Disconnect(context.Background())

	err = client.Ping(context.Background(), nil)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Connected to MONGODB ATLAS")
	studentsCol = client.Database("owl_db").Collection("students")

	// FIBER
	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173/",
		AllowHeaders: "Origin,Content-Type,Accept",
	}))

	// ROUTE
	app.Get("/", helloWorld)
	app.Get("/students/", getStudents)
	app.Get("/students/:id", getStudent)
	app.Patch("/students/:id", updateStudent)

	// Start the server on port 3000
	log.Fatal(app.Listen(":3000"))
}

func helloWorld(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{"message": "Hello, World 👋!"})
}

func getStudents(c *fiber.Ctx) error {
	var students []res.Student

	cursor, err := studentsCol.Find(context.Background(), bson.M{})
	if err != nil {
		return err
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var student res.Student
		if err := cursor.Decode(&student); err != nil {
			return err
		}
		students = append(students, student)
	}

	retList := res.StudentKeys{Object: students}

	return c.JSON(retList)
}

func getStudent(c *fiber.Ctx) error {
	id := c.Params("id")
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid todo ID"})
	}

	filter := bson.M{"_id": objectID}
	row := studentsCol.FindOne(context.Background(), filter)

	var student res.Student
	if row != nil {
		if err := row.Decode(&student); err != nil {
			return err
		}
	}

	return c.Status(200).JSON(student)
}

func updateStudent(c *fiber.Ctx) error {
	valid := &XValidator{validator: validate}

	in := new(req.StudentOfUpdate)
	if err := c.BodyParser(in); err != nil {
		return c.Status(400).JSON(err)
	}

	if errs := valid.Validate(in); len(errs) > 0 {
		return c.Status(400).JSON(errs)
	}

	id := c.Params("id")
	objectID, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid todo ID"})
	}

	filter := bson.M{"_id": objectID}
	update := bson.M{"$set": in}
	opts := options.FindOneAndUpdate().SetReturnDocument(options.After)
	row := studentsCol.FindOneAndUpdate(context.Background(), filter, update, opts)

	var student res.Student
	if err := row.Decode(&student); err != nil {
		return err
	}

	return c.Status(200).JSON(student)
}
