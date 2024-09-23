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
	ID   primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Name string             `json:"name"`
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
