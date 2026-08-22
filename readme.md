```
server/
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
│   │   │   ├── category.validator.ts    # zod/joi schema
│   │   │   └── category.routes.ts       # express router
│   │   │
│   │   ├── subcategory/
│   │   │   ├── subcategory.model.ts
│   │   │   ├── subcategory.controller.ts
│   │   │   ├── subcategory.service.ts
│   │   │   ├── subcategory.validator.ts
│   │   │   └── subcategory.routes.ts
│   │   │
│   │   └── product/
│   │       ├── product.model.ts
│   │       ├── product.controller.ts
│   │       ├── product.service.ts
│   │       ├── product.validator.ts
│   │       └── product.routes.ts
│   │
│   └── utils/
│       ├── apiError.ts              # custom error class w/ status codes
│       ├── apiResponse.ts           # consistent response shape
│       └── catchAsync.ts            # wraps controllers, forwards errors to next()
│
├── .env
├── package.json
└── tsconfig.json
```