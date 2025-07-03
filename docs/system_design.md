# Akawo Mobile Commerce App: System Design Document

## Implementation approach

Based on the provided PRD for the Akawo mobile commerce app, we need to design a robust, scalable system that can handle cross-border e-commerce for Nigerian agro-products and processed foods. The architecture must address several key challenges:

1. **International commerce complexities** - cross-border shipping, customs, and regulatory compliance
2. **User trust and authentication** - secure user accounts and payment processing
3. **Real-time tracking and notifications** - keeping users informed about orders and promotions
4. **Cultural relevance with technical excellence** - maintaining cultural context while providing a modern commerce experience
5. **Flexible catalog management** - supporting diverse product types and vendors

### Technology Stack Selection

Based on the PRD's recommendation, we'll implement the following stack with some additional specifications:

#### Frontend
- **React Native** for cross-platform mobile development
- **TypeScript** for type safety and better developer experience
- **Redux** for state management
- **React Navigation** for routing and navigation
- **Axios** for API communication

#### Backend
- **Node.js** with **Express.js** framework
- **MongoDB** for flexible schema database (products, users, orders)
- **Redis** for caching and session management
- **JWT** for authentication tokens

#### Third-Party Services
- **Authentication**: Firebase Authentication (with social login options)
- **Payment Processing**: Stripe API (primary), PayPal SDK (secondary)
- **Cloud Storage**: AWS S3 for product images and assets
- **Shipping & Logistics**: Shippo API for carrier integration and tracking
- **Push Notifications**: Firebase Cloud Messaging
- **Analytics**: Segment for data collection, Google Analytics for reporting

#### DevOps
- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **CI/CD**: GitHub Actions
- **Hosting**: AWS ECS or Google Cloud Run
- **CDN**: Cloudflare

## Data structures and interfaces

Below are the core data models and their relationships that will power the Akawo application:

### Core Domain Models

1. **User Management**: Authentication, profiles, addresses
2. **Product Catalog**: Products, categories, inventory
3. **Order Processing**: Cart, checkout, orders, payments
4. **Ratings & Reviews**: Product ratings, seller ratings
5. **Shipping & Logistics**: Tracking, delivery options
6. **Notifications**: User alerts and messages

### API Structure

The API will follow RESTful principles with versioning and will be organized by resource domains:

- `/api/v1/auth` - Authentication endpoints
- `/api/v1/users` - User management
- `/api/v1/products` - Product catalog
- `/api/v1/categories` - Product categories
- `/api/v1/cart` - Shopping cart operations
- `/api/v1/orders` - Order processing and tracking
- `/api/v1/payments` - Payment processing
- `/api/v1/reviews` - Product and seller reviews
- `/api/v1/sellers` - Seller profiles and management
- `/api/v1/shipping` - Shipping options and tracking
- `/api/v1/notifications` - User notifications

## Database Schema Design

The MongoDB database will be organized into the following collections with their respective fields:

### Authentication and User Management

#### Users Collection
- `_id` - Unique identifier
- `email` - User email (indexed)
- `passwordHash` - Hashed password (if using email/password auth)
- `authProvider` - Authentication provider (email, Google, Facebook, etc.)
- `authProviderId` - Provider-specific identifier
- `firstName` - User's first name
- `lastName` - User's last name
- `phoneNumber` - Contact number
- `profilePicture` - URL to profile image
- `defaultCurrency` - Preferred currency for pricing
- `preferredLanguage` - Language preference
- `createdAt` - Account creation timestamp
- `updatedAt` - Last update timestamp
- `lastLoginAt` - Last login timestamp
- `status` - Account status (active, suspended, etc.)
- `role` - User role (customer, seller, admin)
- `preferences` - Notification preferences, etc.

#### Addresses Collection
- `_id` - Unique identifier
- `userId` - Reference to User._id
- `addressType` - Type (shipping, billing)
- `isDefault` - Boolean indicating if this is default address
- `fullName` - Recipient's full name
- `addressLine1` - Street address
- `addressLine2` - Additional address info (optional)
- `city` - City
- `state` - State/province
- `postalCode` - ZIP/postal code
- `country` - Country
- `phoneNumber` - Contact number for delivery
- `deliveryInstructions` - Special instructions for delivery

### Product Catalog

#### Categories Collection
- `_id` - Unique identifier
- `name` - Category name
- `slug` - URL-friendly name
- `description` - Category description
- `parentId` - Parent category reference (for hierarchical categories)
- `level` - Hierarchy level
- `imageUrl` - Category image
- `isActive` - Boolean indicating if category is active
- `sortOrder` - Display order

#### Products Collection
- `_id` - Unique identifier
- `sellerId` - Reference to seller
- `name` - Product name
- `slug` - URL-friendly name
- `description` - Detailed description
- `shortDescription` - Brief description
- `categoryIds` - Array of category references
- `originLocation` - Product origin in Nigeria
- `price` - Base price in NGN
- `discountPrice` - Sale price (if applicable)
- `currency` - Base currency (NGN)
- `sku` - Stock keeping unit
- `barcode` - Barcode (if applicable)
- `weight` - Weight in grams
- `dimensions` - Object with length, width, height
- `inventoryCount` - Current stock level
- `allowBackorder` - Whether backorders are allowed
- `isActive` - Product availability status
- `isFeatured` - Whether product is featured
- `tags` - Array of relevant tags
- `attributes` - Object with product attributes (size, color, etc.)
- `shippingClass` - Shipping classification
- `importRestrictions` - Array of countries with import restrictions
- `nutritionalInfo` - Nutritional information
- `expiryDate` - Product shelf life information
- `storageInstructions` - How to store the product
- `certifications` - Array of food safety certifications
- `ingredients` - List of ingredients
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

#### ProductImages Collection
- `_id` - Unique identifier
- `productId` - Reference to Product._id
- `url` - Image URL
- `altText` - Alternative text
- `isPrimary` - Boolean indicating main product image
- `sortOrder` - Display order

#### Sellers Collection
- `_id` - Unique identifier
- `userId` - Reference to User._id of seller account
- `businessName` - Business name
- `description` - About the seller/business
- `logo` - Logo URL
- `coverPhoto` - Cover image URL
- `contactEmail` - Business contact email
- `contactPhone` - Business contact phone
- `website` - Business website
- `socialMedia` - Object with social media links
- `businessAddress` - Physical address
- `isVerified` - Verification status
- `averageRating` - Calculated average rating
- `totalReviews` - Count of seller reviews
- `shippingOptions` - Available shipping methods
- `returnPolicy` - Return policy text
- `createdAt` - Account creation timestamp
- `updatedAt` - Last update timestamp

### Shopping Experience

#### Carts Collection
- `_id` - Unique identifier
- `userId` - Reference to User._id (or anonymous ID)
- `items` - Array of cart items (product, quantity, price)
- `subtotal` - Cart subtotal
- `totalShipping` - Calculated shipping cost
- `totalTax` - Calculated tax
- `totalPrice` - Final total
- `currency` - Currency for pricing
- `appliedCoupons` - Array of applied discounts
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp
- `expiresAt` - Expiration time for guest carts

#### Orders Collection
- `_id` - Unique identifier
- `orderNumber` - Human-readable order number
- `userId` - Reference to User._id
- `items` - Array of order items (product, quantity, price)
- `subtotal` - Order subtotal
- `shippingAddress` - Shipping address
- `billingAddress` - Billing address
- `shippingMethod` - Selected shipping method
- `shippingCost` - Shipping cost
- `taxAmount` - Tax amount
- `importDuties` - Import duties and fees
- `discount` - Applied discount amount
- `totalAmount` - Final order total
- `currency` - Order currency
- `paymentMethod` - Payment method used
- `paymentStatus` - Status of payment
- `fulfillmentStatus` - Status of order fulfillment
- `trackingInfo` - Array of tracking numbers and carriers
- `estimatedDelivery` - Estimated delivery date
- `notes` - Order notes
- `giftMessage` - Gift message if applicable
- `createdAt` - Order creation timestamp
- `updatedAt` - Last update timestamp

#### Payments Collection
- `_id` - Unique identifier
- `orderId` - Reference to Order._id
- `userId` - Reference to User._id
- `paymentIntentId` - Payment provider reference ID
- `paymentMethod` - Payment method details
- `amount` - Payment amount
- `currency` - Payment currency
- `status` - Payment status
- `error` - Error message if payment failed
- `refundStatus` - Refund status if applicable
- `refundAmount` - Refund amount if applicable
- `createdAt` - Payment timestamp
- `updatedAt` - Last update timestamp

### Social Features

#### Reviews Collection
- `_id` - Unique identifier
- `userId` - Reference to User._id
- `productId` - Reference to Product._id (if product review)
- `sellerId` - Reference to Seller._id (if seller review)
- `orderId` - Reference to Order._id
- `rating` - Numerical rating (1-5)
- `title` - Review title
- `content` - Review content
- `images` - Array of image URLs
- `isVerifiedPurchase` - Whether reviewer purchased the item
- `helpfulCount` - Number of users finding review helpful
- `flags` - Count of inappropriate flags
- `status` - Review status (published, pending, etc.)
- `createdAt` - Submission timestamp
- `updatedAt` - Last update timestamp

#### Favorites Collection
- `_id` - Unique identifier
- `userId` - Reference to User._id
- `productId` - Reference to Product._id (if product)
- `sellerId` - Reference to Seller._id (if seller)
- `createdAt` - When favorited

### Notifications and Marketing

#### Notifications Collection
- `_id` - Unique identifier
- `userId` - Reference to User._id
- `type` - Notification type
- `title` - Notification title
- `message` - Notification content
- `imageUrl` - Optional image
- `link` - Deep link to relevant content
- `isRead` - Whether notification is read
- `createdAt` - Creation timestamp

#### Promotions Collection
- `_id` - Unique identifier
- `name` - Promotion name
- `description` - Promotion details
- `type` - Promotion type
- `value` - Discount value or percentage
- `code` - Promotion code (if applicable)
- `minimumPurchase` - Minimum order amount
- `startDate` - Promotion start date
- `endDate` - Promotion end date
- `usageLimit` - Maximum number of uses
- `usageCount` - Current use count
- `eligibleProducts` - Array of eligible product IDs
- `eligibleCategories` - Array of eligible category IDs
- `eligibleUsers` - Array of eligible user IDs
- `isActive` - Whether promotion is currently active

## API Endpoints

Below are the key API endpoints that will support the Akawo mobile commerce app functionality:

### Authentication
- `POST /api/v1/auth/register` - Create new user account
- `POST /api/v1/auth/login` - Login with email/password
- `POST /api/v1/auth/social` - Social media authentication
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password with token
- `POST /api/v1/auth/logout` - Logout user

### User Management
- `GET /api/v1/users/profile` - Get current user profile
- `PUT /api/v1/users/profile` - Update user profile
- `GET /api/v1/users/addresses` - List user addresses
- `POST /api/v1/users/addresses` - Add new address
- `PUT /api/v1/users/addresses/:id` - Update address
- `DELETE /api/v1/users/addresses/:id` - Delete address
- `GET /api/v1/users/payment-methods` - List saved payment methods
- `POST /api/v1/users/payment-methods` - Add payment method
- `DELETE /api/v1/users/payment-methods/:id` - Remove payment method

### Product Catalog
- `GET /api/v1/categories` - List all categories
- `GET /api/v1/categories/:id/products` - List products in category
- `GET /api/v1/products` - List products with filtering
- `GET /api/v1/products/featured` - Get featured products
- `GET /api/v1/products/:id` - Get product details
- `GET /api/v1/products/:id/related` - Get related products
- `GET /api/v1/products/search` - Search products

### Shopping Experience
- `GET /api/v1/cart` - Get current cart
- `POST /api/v1/cart/items` - Add item to cart
- `PUT /api/v1/cart/items/:id` - Update cart item
- `DELETE /api/v1/cart/items/:id` - Remove cart item
- `POST /api/v1/cart/coupon` - Apply coupon code
- `DELETE /api/v1/cart/coupon` - Remove coupon code
- `POST /api/v1/checkout/shipping-options` - Get shipping options
- `POST /api/v1/checkout/calculate-duties` - Calculate import duties
- `POST /api/v1/checkout/payment-intent` - Create payment intent
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders` - List user orders
- `GET /api/v1/orders/:id` - Get order details
- `GET /api/v1/orders/:id/tracking` - Get order tracking info

### Social Features
- `GET /api/v1/products/:id/reviews` - Get product reviews
- `POST /api/v1/products/:id/reviews` - Add product review
- `GET /api/v1/sellers/:id/reviews` - Get seller reviews
- `POST /api/v1/sellers/:id/reviews` - Add seller review
- `GET /api/v1/favorites` - Get user favorites
- `POST /api/v1/favorites` - Add favorite
- `DELETE /api/v1/favorites/:id` - Remove favorite

### Sellers
- `GET /api/v1/sellers` - List sellers
- `GET /api/v1/sellers/:id` - Get seller details
- `GET /api/v1/sellers/:id/products` - Get seller products

### Notifications
- `GET /api/v1/notifications` - Get user notifications
- `PUT /api/v1/notifications/:id` - Mark notification as read
- `DELETE /api/v1/notifications/:id` - Delete notification
- `POST /api/v1/notifications/settings` - Update notification settings

## Authentication Flow and Security Considerations

### Authentication Flow

1. **Registration Process**
   - Users can register with email/password or social login
   - Email verification for email registrations
   - Account creation with minimal required fields
   - Progressive profile completion

2. **Login Flow**
   - Email/password authentication
   - Social login (Google, Facebook, Apple)
   - JWT token issuance with limited expiry
   - Refresh token mechanism for session persistence
   - Biometric authentication option on device

3. **Authentication Architecture**
   - Firebase Authentication for identity management
   - JWT tokens for API authorization
   - Token storage in secure device storage
   - Automatic token refresh mechanism

### Security Considerations

1. **Data Protection**
   - All API communications over HTTPS
   - Data encryption at rest in database
   - PII (Personally Identifiable Information) encryption
   - Secure credential storage (no plaintext passwords)

2. **API Security**
   - Rate limiting to prevent abuse
   - CSRF protection
   - Input validation and sanitization
   - Parameter validation
   - SQL/NoSQL injection prevention
   - Security headers implementation

3. **Payment Security**
   - PCI DSS compliance through Stripe/PayPal
   - No storage of complete card details on our servers
   - Tokenization of payment methods
   - 3D Secure support where available

4. **Application Security**
   - Regular security audits and penetration testing
   - Dependency vulnerability scanning
   - Secure coding practices
   - OWASP Top 10 mitigation strategies

5. **User Account Protection**
   - Account lockout after failed attempts
   - Two-factor authentication option
   - Suspicious activity detection
   - Secure password reset flow

## Payment Gateway Integration

### Stripe Integration

1. **Setup and Configuration**
   - Multi-currency support
   - Automatic currency conversion
   - Support for major credit/debit cards
   - Setup of webhook endpoints for payment events

2. **Payment Flow**
   - Create payment intent on checkout initiation
   - Collect payment details in Stripe Elements UI
   - Process payment client-side with Stripe SDK
   - Confirm payment on backend
   - Handle success/failure scenarios

3. **Features**
   - Save cards for future use (with user permission)
   - Automatic retries for failed payments
   - Partial capture and refunds support
   - Detailed receipt generation
   - Fraud detection integration

### PayPal Integration

1. **Setup and Configuration**
   - PayPal REST API integration
   - PayPal SDK integration in mobile app
   - Webhook configuration for payment notifications

2. **Payment Flow**
   - Initialize PayPal payment
   - Redirect to PayPal authentication
   - Process payment approval
   - Verify payment completion
   - Return to app with success/cancel

3. **Features**
   - PayPal account and guest checkout
   - Express checkout option
   - Refund processing
   - Payment status tracking

### Multi-Currency Support

1. **Currency Management**
   - Base pricing in NGN (Nigerian Naira)
   - Dynamic currency conversion for display
   - Support for USD, EUR, GBP as primary target currencies
   - Daily exchange rate updates

2. **Pricing Display**
   - User preference-based currency display
   - Clear indication of exchange rates used
   - Transparency about conversion fees

### Transaction Security

1. **Fraud Prevention**
   - Address Verification Service (AVS)
   - Card Verification Value (CVV) requirement
   - Suspicious transaction flagging
   - IP geolocation validation
   - Device fingerprinting

2. **Compliance**
   - GDPR compliance for European users
   - Strong Customer Authentication (SCA) support for EU
   - Regional tax compliance

## Order Tracking and Logistics Integration

### Shippo API Integration

1. **Carrier Integration**
   - Multi-carrier support (DHL, FedEx, UPS, etc.)
   - Automated shipping label generation
   - Address validation and correction
   - International customs documentation

2. **Shipping Options**
   - Multiple shipping speed options
   - Consolidated shipping for multi-item orders
   - Split shipments when necessary
   - Special handling for perishable goods

3. **Tracking System**
   - Real-time tracking status updates
   - Shipment milestone notifications
   - Delivery exception handling
   - Estimated delivery date calculation

### Order Status Management

1. **Order Lifecycle**
   - Order placed
   - Payment confirmed
   - Order processing
   - Order packed
   - Shipped
   - In transit (with customs updates for international)
   - Out for delivery
   - Delivered
   - Return/refund (if applicable)

2. **Customs and Import Process**
   - HS code assignment for products
   - Customs declaration automation
   - Import duty and tax calculation
   - Customs clearance status tracking

3. **Issue Management**
   - Delivery exception handling
   - Lost package procedures
   - Damaged goods process
   - Return authorization system

### Last Mile Tracking

1. **Delivery Experience**
   - Delivery window estimation
   - Delivery instructions management
   - Proof of delivery capture
   - Delivery attempt notifications

2. **Regional Considerations**
   - Country-specific delivery partners
   - Address format localization
   - Local delivery restrictions awareness

## Push Notification System

### Firebase Cloud Messaging Implementation

1. **Notification Types**
   - Order status updates
   - Shipping and delivery notifications
   - Payment confirmations and issues
   - Product restocks and price drops
   - Promotional campaigns and offers
   - Product recommendations
   - Review requests

2. **Technical Implementation**
   - Device token management
   - Topic-based subscriptions
   - Message prioritization
   - Rich notifications with images
   - Deep linking to app screens
   - Silent notifications for in-app updates

3. **User Preferences**
   - Granular notification preferences
   - Time-of-day delivery restrictions
   - Frequency capping to prevent overload
   - One-click unsubscribe option

### Notification Scheduling and Triggers

1. **Event-based Notifications**
   - Order status changes
   - Price changes on favorite items
   - Stock alerts
   - Review reminder after delivery

2. **Scheduled Notifications**
   - Promotional campaigns
   - Cultural holiday reminders
   - Personalized recommendations
   - Re-engagement campaigns

3. **Real-time vs. Batched Notifications**
   - Critical alerts sent real-time
   - Marketing messages batched by user time zone
   - Intelligent delivery timing based on user activity

### In-app Messaging

1. **Message Center**
   - Persistent notification history
   - Message categorization
   - Rich content support
   - Action buttons within messages
   - Read/unread status tracking

2. **Chat Support Option**
   - Direct messaging with sellers
   - Customer support chat integration
   - Order-related inquiries
   - Media sharing capabilities

## Anything UNCLEAR

1. **Product Import Regulations**
   - The specific regulatory compliance requirements for Nigerian food products in different countries (US, UK, EU) need to be clarified and researched to ensure the platform handles all necessary documentation and restrictions.

2. **Cold Chain Requirements**
   - For perishable products, the specific cold chain logistics requirements need to be defined in more detail, including which shipping partners can maintain temperature control throughout the international shipping process.

3. **Seller Onboarding Process**
   - The PRD doesn't provide details on the seller onboarding process, verification requirements, and commission structure, which will be crucial for the marketplace aspect of the platform.

4. **Return and Refund Logistics**
   - International returns are complex and expensive. More clarity is needed on the return policy and logistics for cross-border shipments, especially for food products.

5. **Payment Settlement Process**
   - The process for settling payments to Nigerian sellers needs more clarification, considering Nigerian foreign exchange controls and international banking regulations.

6. **Cultural Calendar Integration**
   - While mentioned as a P2 feature, more details on the specific Nigerian cultural events and how they should be integrated into the promotional calendar would be valuable.

7. **Food Certification Requirements**
   - The specific food safety certifications required for each market and how they will be verified and displayed on the platform needs more detail.

8. **Beta Testing Strategy**
   - The implementation plan doesn't specify a beta testing strategy for the target diaspora communities, which would be crucial given the specific cultural context of the application.