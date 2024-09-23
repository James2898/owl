package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

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

var studentsCol *mongo.Collection

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
	var students []Student

	cursor, err := studentsCol.Find(context.Background(), bson.M{})
	if err != nil {
		return err
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var student Student
		if err := cursor.Decode(&student); err != nil {
			return err
		}
		students = append(students, student)
	}

	return c.JSON(students)
}

func getStudent(c *fiber.Ctx) error {
	id := c.Params("id")
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid todo ID"})
	}

	filter := bson.M{"_id": objectID}
	row := studentsCol.FindOne(context.Background(), filter)

	var student Student
	if row != nil {
		if err := row.Decode(&student); err != nil {
			return err
		}
	}

	return c.Status(200).JSON(student)
}

func updateStudent(c *fiber.Ctx) error {
	id := c.Params("id")
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid todo ID"})
	}

	filter := bson.M{"_id": objectID}
	row := studentsCol.FindOne(context.Background(), filter)

	var student Student
	if row != nil {
		if err := row.Decode(&student); err != nil {

		}
	}

	return c.Status(200).JSON(student)
}
