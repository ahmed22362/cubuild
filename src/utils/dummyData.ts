import Product from "../models/product.model"
import ReviewModel, { IReviewDocument } from "../models/review.model"
import mongoose from "mongoose"

const dummyProducts = [
  {
    title: "3D Printed Phone Stand",
    description: "A stylish phone stand made using 3D printing technology.",
    price: 12.99,
    coverImage:
      "https://res.cloudinary.com/dibfyga2v/image/upload/v1693678822/product-images/image_6-removebg-preview-1693678820276.png",
    images: [
      "https://res.cloudinary.com/dibfyga2v/image/upload/v1693678822/product-images/fmoq5ydh-removebg-preview-1693678820519.png",
      "https://res.cloudinary.com/dibfyga2v/image/upload/v1693678822/product-images/msqc93tv-removebg-preview-1693678820278.png",
    ],
    options: [
      {
        name: "Color",
        values: ["Black", "White", "Red"],
      },
      {
        name: "Material",
        values: ["PLA", "PETG"],
      },
    ],
  },
  {
    title: "3D Printed Keychain",
    description: "A personalized keychain created through 3D printing.",
    price: 5.99,
    coverImage:
      "https://res.cloudinary.com/dibfyga2v/image/upload/v1693678822/product-images/fmoq5ydh-removebg-preview-1693678820519.png",
    images: [
      "https://res.cloudinary.com/dibfyga2v/image/upload/v1693678822/product-images/msqc93tv-removebg-preview-1693678820278.png",
      "https://res.cloudinary.com/dibfyga2v/image/upload/v1693678822/product-images/image_6-removebg-preview-1693678820276.png",
    ],
    options: [
      {
        name: "Color",
        values: ["Blue", "Green", "Yellow"],
      },
    ],
  },
  {
    title: "3D Printed Mini Figurine",
    description: "A small 3D printed figurine perfect for decoration.",
    price: 8.99,
    coverImage:
      "https://res.cloudinary.com/dibfyga2v/image/upload/v1693678822/product-images/fmoq5ydh-removebg-preview-1693678820519.png",
    images: [
      "https://res.cloudinary.com/dibfyga2v/image/upload/v1693678822/product-images/msqc93tv-removebg-preview-1693678820278.png",
      "https://res.cloudinary.com/dibfyga2v/image/upload/v1693678822/product-images/image_6-removebg-preview-1693678820276.png",
    ],
    options: [
      {
        name: "Character",
        values: ["Robot", "Animal", "Human"],
      },
    ],
  },
  {
    title: "Custom 3D Printed Jewelry",
    description: "Elegant and unique jewelry pieces created with 3D printing.",
    price: 19.99,
    images: ["jewelry_1.jpg", "jewelry_2.jpg"],
    options: [
      {
        name: "Design",
        values: ["Pendant", "Earrings", "Ring"],
      },
      {
        name: "Material",
        values: ["Silver", "Gold", "Rose Gold"],
      },
    ],
  },
  {
    title: "3D Printed Plant Pot",
    description: "Decorative plant pot crafted using 3D printing techniques.",
    price: 14.99,
    coverImage:
      "https://res.cloudinary.com/dibfyga2v/image/upload/v1693678822/product-images/image_6-removebg-preview-1693678820276.png",

    images: [
      "https://res.cloudinary.com/dibfyga2v/image/upload/v1693678822/product-images/fmoq5ydh-removebg-preview-1693678820519.png",
      "https://res.cloudinary.com/dibfyga2v/image/upload/v1693678822/product-images/msqc93tv-removebg-preview-1693678820278.png",
    ],
    options: [
      {
        name: "Color",
        values: ["Terracotta", "White", "Green"],
      },
      {
        name: "Size",
        values: ["Small", "Medium", "Large"],
      },
    ],
  },
  {
    title: "3D Printed Puzzle",
    description: "A challenging puzzle made using 3D printed pieces.",
    price: 10.99,
    coverImage:
      "https://res.cloudinary.com/dibfyga2v/image/upload/v1693678822/product-images/msqc93tv-removebg-preview-1693678820278.png",
    images: [
      "https://res.cloudinary.com/dibfyga2v/image/upload/v1693678822/product-images/fmoq5ydh-removebg-preview-1693678820519.png",
      "https://res.cloudinary.com/dibfyga2v/image/upload/v1693678822/product-images/image_6-removebg-preview-1693678820276.png",
    ],
    options: [
      {
        name: "Difficulty",
        values: ["Easy", "Medium", "Hard"],
      },
      {
        name: "Theme",
        values: ["Nature", "Architecture", "Animals"],
      },
    ],
  },
  {
    title: "3D Printed Desk Organizer",
    description:
      "An organizer for your desk items created through 3D printing.",
    price: 17.99,
    coverImage:
      "https://res.cloudinary.com/dibfyga2v/image/upload/v1693678822/product-images/msqc93tv-removebg-preview-1693678820278.png",
    images: [
      "https://res.cloudinary.com/dibfyga2v/image/upload/v1693678822/product-images/fmoq5ydh-removebg-preview-1693678820519.png",
      "https://res.cloudinary.com/dibfyga2v/image/upload/v1693678822/product-images/image_6-removebg-preview-1693678820276.png",
    ],
    options: [
      {
        name: "Color",
        values: ["Black", "White", "Gray"],
      },
      {
        name: "Compartments",
        values: ["2", "4", "6"],
      },
    ],
  },
  {
    title: "3D Printed Cookie Cutter Set",
    description: "Set of cookie cutters with various 3D printed shapes.",
    price: 9.99,
    coverImage:
      "https://res.cloudinary.com/dibfyga2v/image/upload/v1693678822/product-images/image_6-removebg-preview-1693678820276.png",
    images: [
      "https://res.cloudinary.com/dibfyga2v/image/upload/v1693678822/product-images/fmoq5ydh-removebg-preview-1693678820519.png",
      "https://res.cloudinary.com/dibfyga2v/image/upload/v1693678822/product-images/msqc93tv-removebg-preview-1693678820278.png",
    ],
    options: [
      {
        name: "Shapes",
        values: ["Heart", "Star", "Circle", "Square"],
      },
    ],
  },
  {
    title: "3D Printed Board Game Pieces",
    description: "Replacement board game pieces created through 3D printing.",
    price: 6.99,
    images: ["board_game_1.jpg", "board_game_2.jpg"],
    options: [
      {
        name: "Game",
        values: ["Chess", "Monopoly", "Catan"],
      },
      {
        name: "Color",
        values: ["Red", "Blue", "Green", "Yellow"],
      },
    ],
  },
  {
    title: "3D Printed Wall Art",
    description: "Artistic wall decorations produced using 3D printing.",
    price: 22.99,
    coverImage:
      "https://res.cloudinary.com/dibfyga2v/image/upload/v1693678822/product-images/msqc93tv-removebg-preview-1693678820278.png",
    images: [
      "https://res.cloudinary.com/dibfyga2v/image/upload/v1693678822/product-images/fmoq5ydh-removebg-preview-1693678820519.png",
      "https://res.cloudinary.com/dibfyga2v/image/upload/v1693678822/product-images/image_6-removebg-preview-1693678820276.png",
    ],
    options: [
      {
        name: "Design",
        values: ["Abstract", "Landscape", "Geometric"],
      },
      {
        name: "Size",
        values: ["Small", "Medium", "Large"],
      },
    ],
  },
]

export async function insertDummyProducts() {
  try {
    await Product.deleteMany()

    for (const productData of dummyProducts) {
      const product = new Product(productData)
      await product.save()
      console.log(`Inserted: ${product.title}`)
    }

    console.log("Dummy data inserted successfully.")
  } catch (error) {
    console.error("Error inserting dummy data:", error)
  }
}
const NUM_REVIEWS_PER_PRODUCT = 15

// Create a function to generate random ratings and review bodies
const generateRandomReviews = (numReviews: number): IReviewDocument[] => {
  const reviews: IReviewDocument[] = []
  for (let i = 0; i < numReviews; i++) {
    const rating = Math.floor(Math.random() * 5) + 1 // Random rating between 1 and 5
    const body = `This is review #${i + 1}`
    reviews.push({ rating, body } as IReviewDocument)
  }
  return reviews
}

// Insert reviews for each product
export const insertDummyReviews = async () => {
  try {
    await ReviewModel.deleteMany()
    console.log("All Previous Reviews deleted successfully!")
    const products = await Product.find()
    for (const product of products) {
      const reviews = generateRandomReviews(NUM_REVIEWS_PER_PRODUCT)
      for (const review of reviews) {
        // Associate the review with the product and a random user
        const user = new mongoose.Types.ObjectId("64ea4035d6bef77c1f1156d8")
        const newReview = new ReviewModel({
          ...review,
          user,
          product: product.id,
        })
        await newReview.save()
      }
    }

    console.log("Reviews inserted successfully!")
  } catch (error) {
    console.error("Error inserting reviews:", error)
  }
}
