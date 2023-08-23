import Product from "../models/product.model"

const dummyProducts = [
  {
    title: "3D Printed Phone Stand",
    description: "A stylish phone stand made using 3D printing technology.",
    price: 12.99,
    images: ["phone_stand_1.jpg", "phone_stand_2.jpg"],
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
    images: ["keychain_1.jpg", "keychain_2.jpg"],
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
    images: ["figurine_1.jpg", "figurine_2.jpg"],
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
    images: ["plant_pot_1.jpg", "plant_pot_2.jpg"],
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
    images: ["puzzle_1.jpg", "puzzle_2.jpg"],
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
    images: ["organizer_1.jpg", "organizer_2.jpg"],
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
    images: ["cookie_cutter_1.jpg", "cookie_cutter_2.jpg"],
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
    images: ["wall_art_1.jpg", "wall_art_2.jpg"],
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
    await Product.deleteMany() // Clear existing data

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
