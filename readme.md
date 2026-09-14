```
electro-server/
├── src/
│   ├── index.ts                     # entry point — connects DB, starts server
│   ├── app.ts                       # express app setup, middleware & route mounting
│   │
│   ├── config/
│   │   ├── db.ts                    # mongoose connection
│   │   └── env.ts                   # environment variable validation/export
│   │
│   ├── middlewares/
│   │   ├── error.middleware.ts      # global error handler (mounted last)
│   │   └── notFound.middleware.ts   # 404 handler
│   │
│   ├── modules/
│   │   ├── category/
│   │   │   ├── category.model.ts        # mongoose schema
│   │   │   ├── category.controller.ts   # req/res handlers, thin
│   │   │   ├── category.service.ts      # business logic
│   │   │   ├── category.validator.ts    # zod schema
│   │   │   └── category.routes.ts       # express router
│   │   │
│   │   ├── subcategory/
│   │   │   ├── subcategory.model.ts
│   │   │   ├── subcategory.controller.ts
│   │   │   ├── subcategory.service.ts
│   │   │   ├── subcategory.validator.ts
│   │   │   └── subcategory.routes.ts
│   │   │
│   │   ├── product/
│   │   │   ├── product.model.ts
│   │   │   ├── product.controller.ts
│   │   │   ├── product.service.ts
│   │   │   ├── product.validator.ts
│   │   │   └── product.routes.ts
│   │   │
│   │   ├── review/
│   │   │   ├── review.model.ts
│   │   │   ├── review.controller.ts
│   │   │   ├── review.service.ts
│   │   │   ├── review.validator.ts
│   │   │   └── review.routes.ts
│   │   │
│   │   ├── wishlist/
│   │   │   ├── wishlist.model.ts
│   │   │   ├── wishlist.controller.ts
│   │   │   ├── wishlist.service.ts
│   │   │   ├── wishlist.validator.ts
│   │   │   └── wishlist.routes.ts
│   │   │
│   │   ├── cart/
│   │   │   ├── cart.model.ts
│   │   │   ├── cart.controller.ts
│   │   │   ├── cart.service.ts
│   │   │   ├── cart.validator.ts
│   │   │   └── cart.routes.ts
│   │   │
│   │   └── user/
│   │       ├── user.model.ts
│   │       ├── user.controller.ts
│   │       ├── user.service.ts
│   │       ├── user.validator.ts
│   │       └── user.routes.ts
│   │
│   ├── utils/
│   │   ├── apiError.ts              # custom error class w/ status codes
│   │   ├── apiResponse.ts           # consistent response shape
│   │   ├── catchAsync.ts            # wraps controllers, forwards errors to next()
│   │   └── validate.ts              # validation utility
│   │
│   └── data/
│       ├── categories.json          # seed data for categories
│       ├── subCategories.json      # seed data for subcategories
│       ├── products.json            # seed data for products
│       └── reviews.json             # seed data for reviews
│
├── api/
│   └── index.ts                     # additional API utilities
│
├── .env
├── package.json
├── tsconfig.json
└── readme.md
```