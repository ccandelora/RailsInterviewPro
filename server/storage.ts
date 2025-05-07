import { questions, userPreferences, users, type User, type InsertUser, type Question, type InsertQuestion, type UserPreference, type InsertUserPreference } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Question methods
  getAllQuestions(): Promise<Question[]>;
  getQuestionById(id: number): Promise<Question | undefined>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  
  // User Preferences methods
  getUserPreferences(userId: number): Promise<UserPreference[]>;
  updateUserPreference(preference: InsertUserPreference): Promise<UserPreference>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private questionsList: Map<number, Question>;
  private userPrefs: Map<number, UserPreference>;
  private userId: number;
  private questionId: number;
  private prefId: number;

  constructor() {
    this.users = new Map();
    this.questionsList = new Map();
    this.userPrefs = new Map();
    this.userId = 1;
    this.questionId = 1;
    this.prefId = 1;
    
    // Add initial questions
    this.seedQuestions();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async getAllQuestions(): Promise<Question[]> {
    return Array.from(this.questionsList.values());
  }
  
  async getQuestionById(id: number): Promise<Question | undefined> {
    return this.questionsList.get(id);
  }
  
  async createQuestion(question: InsertQuestion): Promise<Question> {
    const id = this.questionId++;
    const newQuestion: Question = { ...question, id };
    this.questionsList.set(id, newQuestion);
    return newQuestion;
  }
  
  async getUserPreferences(userId: number): Promise<UserPreference[]> {
    return Array.from(this.userPrefs.values()).filter(
      (pref) => pref.userId === userId
    );
  }
  
  async updateUserPreference(preference: InsertUserPreference): Promise<UserPreference> {
    // Check if preference already exists
    const existingPref = Array.from(this.userPrefs.values()).find(
      (pref) => pref.userId === preference.userId && pref.questionId === preference.questionId
    );
    
    if (existingPref) {
      const updatedPref: UserPreference = {
        ...existingPref,
        isFavorite: preference.isFavorite,
        isCompleted: preference.isCompleted
      };
      this.userPrefs.set(existingPref.id, updatedPref);
      return updatedPref;
    } else {
      // Create new preference
      const id = this.prefId++;
      const newPref: UserPreference = { 
        ...preference, 
        id 
      };
      this.userPrefs.set(id, newPref);
      return newPref;
    }
  }
  
  private seedQuestions() {
    const questionsData: InsertQuestion[] = [
      {
        question: "What is Ruby on Rails?",
        answer: "Ruby on Rails, or Rails, is an open-source web application framework written in Ruby. It follows the MVC (Model-View-Controller) architectural pattern and emphasizes Convention over Configuration (CoC) and Don't Repeat Yourself (DRY) principles. Rails is designed to make programming web applications easier by making assumptions about what every developer needs to get started.",
        category: "Fundamentals",
        difficulty: "beginner",
      },
      {
        question: "Explain the MVC architecture in Rails",
        answer: "MVC (Model-View-Controller) is an architectural pattern that separates an application into three main components:\n\n- **Model**: Handles data and business logic. In Rails, models interact with the database, handle validation, associations, and callbacks.\n\n- **View**: Represents the user interface. In Rails, views are typically ERB (Embedded Ruby) templates that display data to users.\n\n- **Controller**: Acts as an intermediary between the Model and View. Controllers receive requests, interact with models to gather data, and pass that data to views for rendering.",
        category: "Architecture",
        difficulty: "beginner",
      },
      {
        question: "What are Rails migrations?",
        answer: "Migrations are a feature of Rails that allows you to evolve your database schema over time. They're Ruby classes that create, modify, or drop database tables, columns, or indexes. Migrations make it easier for teams to collaborate by providing a consistent way to modify the database structure.\n\n```ruby\nclass CreateUsers < ActiveRecord::Migration[6.1]\n  def change\n    create_table :users do |t|\n      t.string :name\n      t.string :email\n      t.timestamps\n    end\n  end\nend\n```",
        category: "Database",
        difficulty: "beginner",
      },
      {
        question: "What is Active Record in Rails?",
        answer: "Active Record is the M in MVC - the model - which is the layer of the system responsible for representing business data and logic. It facilitates the creation and use of objects whose data requires persistent storage to a database. Active Record implements the Object-Relational Mapping (ORM) pattern, which connects rich objects to database tables.\n\n```ruby\nclass User < ApplicationRecord\n  has_many :posts\n  validates :email, presence: true, uniqueness: true\n  \n  def full_name\n    \"#{first_name} #{last_name}\"\n  end\nend\n```",
        category: "ORM",
        difficulty: "beginner",
      },
      {
        question: "Explain the difference between 'has_many' and 'has_many :through' associations",
        answer: "Both are Active Record associations used to set up relationships between models:\n\n- **has_many**: Creates a one-to-many relationship directly. For example, an Author has many Books.\n\n```ruby\nclass Author < ApplicationRecord\n  has_many :books\nend\n```\n\n- **has_many :through**: Creates a many-to-many relationship using a join model. For example, a Doctor has many Patients through Appointments.\n\n```ruby\nclass Doctor < ApplicationRecord\n  has_many :appointments\n  has_many :patients, through: :appointments\nend\n```\n\nThe key difference is that 'has_many :through' allows you to establish a many-to-many connection with another model through a third model (join table), while 'has_many' establishes a direct one-to-many relationship.",
        category: "ORM",
        difficulty: "intermediate",
      },
      {
        question: "What is the difference between 'destroy' and 'delete' in Rails?",
        answer: "Both methods are used to remove records from the database, but they operate differently:\n\n- **delete**: Performs a direct SQL DELETE operation, removing the record from the database without loading it or running any callbacks. It's faster but bypasses validations and callbacks.\n\n```ruby\nUser.delete(1)  # Deletes the user with ID 1\nusers.delete_all  # Deletes all users in the collection\n```\n\n- **destroy**: Loads the record, runs callbacks (like `before_destroy` and `after_destroy`), checks dependencies, and then removes it from the database. It's slower but ensures data integrity.\n\n```ruby\nuser.destroy  # Destroys a user instance\nUser.destroy(1)  # Loads and destroys the user with ID 1\nusers.destroy_all  # Loads and destroys all users in the collection\n```",
        category: "ORM",
        difficulty: "intermediate",
      },
      {
        question: "What are strong parameters in Rails?",
        answer: "Strong parameters are a feature of Rails that prevent assigning request parameters to models unless they have been explicitly permitted. This helps protect against mass assignment vulnerabilities. They are typically used in controllers to whitelist which parameters are allowed for mass assignment.\n\n```ruby\nclass UsersController < ApplicationController\n  def create\n    @user = User.new(user_params)\n    if @user.save\n      redirect_to @user\n    else\n      render 'new'\n    end\n  end\n  \n  private\n  \n  def user_params\n    params.require(:user).permit(:name, :email, :password)\n  end\nend\n```",
        category: "Security",
        difficulty: "intermediate",
      },
      {
        question: "Explain what the Rails Asset Pipeline is",
        answer: "The Asset Pipeline is a framework in Rails that concatenates, minifies, and compresses JavaScript and CSS assets. It also adds asset fingerprinting for browser caching. The primary features include:\n\n1. **Concatenation**: Combines multiple files into one, reducing HTTP requests.\n2. **Minification**: Removes unnecessary whitespace and comments to reduce file size.\n3. **Compression**: Further reduces file size using gzip.\n4. **Fingerprinting**: Appends a hash of the file content to filenames, enabling browsers to cache assets effectively.\n5. **Preprocessing**: Allows use of languages like Sass for CSS and CoffeeScript for JavaScript.\n\nStarting with Rails 6, Webpacker is the default JavaScript compiler, working alongside the asset pipeline.",
        category: "Frontend",
        difficulty: "intermediate",
      },
      {
        question: "What is turbolinks in Rails?",
        answer: "Turbolinks is a JavaScript library that speeds up page renders by using AJAX to replace only the body of the page and update the browser's history, rather than doing a full page reload. It makes navigating a web application faster by avoiding the overhead of full page rendering.\n\nWhen a user clicks a link, Turbolinks:\n1. Intercepts the click event\n2. Makes an AJAX request for the new page\n3. Replaces the current page's body with the new one\n4. Updates the browser's history using the History API\n\nThis creates a SPA-like experience without the complexity of a full single-page application framework. In Rails 7, Turbolinks has been replaced by Turbo, part of the Hotwire suite.",
        category: "Frontend",
        difficulty: "intermediate",
      },
      {
        question: "What are N+1 queries and how can you avoid them in Rails?",
        answer: "An N+1 query problem occurs when your code executes N additional queries to fetch related objects for N results from an initial query. This typically happens when you retrieve a collection of objects and then loop through them accessing their associations, causing one additional query per object.\n\n```ruby\n# This causes N+1 queries\nposts = Post.all\nposts.each do |post|\n  puts post.author.name # Executes a separate query for each post's author\nend\n```\n\nYou can avoid N+1 queries using **eager loading** with `includes`, `preload`, or `eager_load`:\n\n```ruby\n# This executes just 2 queries (one for posts, one for authors)\nposts = Post.includes(:author).all\nposts.each do |post|\n  puts post.author.name # No additional queries\nend\n```\n\nRails also provides the `bullet` gem which helps identify N+1 query problems during development.",
        category: "Performance",
        difficulty: "advanced",
      },
      {
        question: "What are callbacks in Rails?",
        answer: "Callbacks are methods that get called at certain moments in an object's lifecycle. They allow you to trigger logic before or after state changes in a model. For example, you might use a callback to set a default value before saving a record, or to send an email after creating a user.\n\nCommon callbacks include:\n\n```ruby\nclass User < ApplicationRecord\n  # Called before a new record is saved\n  before_create :generate_token\n  \n  # Called after a record is created\n  after_create :send_welcome_email\n  \n  # Called before validations when a record is created or updated\n  before_validation :normalize_email\n  \n  private\n  \n  def generate_token\n    self.token = SecureRandom.hex(10)\n  end\n  \n  def send_welcome_email\n    UserMailer.welcome_email(self).deliver_later\n  end\n  \n  def normalize_email\n    self.email = email.downcase.strip if email.present?\n  end\nend\n```\n\nCallbacks should be used with caution as they can make code harder to understand and test.",
        category: "ORM",
        difficulty: "intermediate",
      },
      {
        question: "Explain the different types of caching in Rails",
        answer: "Rails provides several types of caching to improve application performance:\n\n1. **Page Caching**: Caches an entire page as a static HTML file. Fast but rarely used now because it doesn't work with actions that require authentication.\n\n2. **Action Caching**: Similar to page caching but runs before filters first, allowing authentication checks. Removed from Rails 4 but available as a gem.\n\n3. **Fragment Caching**: Caches just parts of a view. Useful for dynamic pages with static components.\n\n```ruby\n<% cache product do %>\n  <div class=\"product\">\n    <%= product.name %>\n  </div>\n<% end %>\n```\n\n4. **Russian Doll Caching**: Nested fragment caching where inner fragments are embedded within outer fragments.\n\n5. **Low-Level Caching**: Manual caching of specific data using `Rails.cache.fetch`.\n\n```ruby\nRails.cache.fetch(\"product/#{product.id}/price\", expires_in: 12.hours) do\n  product.calculate_price\nend\n```\n\n6. **SQL Caching**: Rails automatically caches SQL queries during a single request.\n\n7. **HTTP Caching**: Using HTTP headers like ETag and Last-Modified for browser and proxy caching.",
        category: "Performance",
        difficulty: "advanced",
      },
      {
        question: "What is Hotwire in Rails?",
        answer: "Hotwire is a modern approach to building web applications without much JavaScript. It was introduced in Rails 7 and consists of three main components:\n\n1. **Turbo**: The successor to Turbolinks, which accelerates links and form submissions. It includes:\n   - Turbo Drive: Speeds up page navigation\n   - Turbo Frames: Updates specific parts of a page\n   - Turbo Streams: Delivers page changes over WebSocket\n\n2. **Stimulus**: A modest JavaScript framework for adding behavior to HTML\n\n3. **Strada**: For building mobile hybrid applications (less commonly used)\n\nHotwire allows Rails developers to build modern, dynamic interfaces using mostly server-side code, reducing the need for complex JavaScript frameworks like React or Vue.js.",
        category: "Frontend",
        difficulty: "advanced",
      },
      {
        question: "What are service objects in Rails?",
        answer: "Service objects are a design pattern for organizing business logic that doesn't clearly belong in a model or controller. They help maintain the 'skinny controller, skinny model' principle by extracting complex operations into dedicated classes.\n\nCommon use cases include:\n- Complex user registration processes\n- Interacting with external APIs\n- Operations that affect multiple models\n- Background processing tasks\n\n```ruby\n# app/services/order_processor.rb\nclass OrderProcessor\n  def initialize(order, payment_details)\n    @order = order\n    @payment_details = payment_details\n  end\n  \n  def process\n    return false unless @order.valid?\n    \n    begin\n      charge_payment\n      update_inventory\n      send_confirmation\n      true\n    rescue => e\n      # Handle error\n      false\n    end\n  end\n  \n  private\n  \n  def charge_payment\n    # Payment gateway logic\n  end\n  \n  def update_inventory\n    # Update inventory counts\n  end\n  \n  def send_confirmation\n    OrderMailer.confirmation(@order).deliver_later\n  end\nend\n```\n\nUsage:\n```ruby\nclass OrdersController < ApplicationController\n  def create\n    @order = Order.new(order_params)\n    processor = OrderProcessor.new(@order, payment_params)\n    \n    if processor.process\n      redirect_to order_path(@order), notice: 'Order was successfully placed.'\n    else\n      render :new\n    end\n  end\nend\n```",
        category: "Architecture",
        difficulty: "advanced",
      },
      {
        question: "Explain CSRF protection in Rails",
        answer: "Cross-Site Request Forgery (CSRF) is an attack that forces users to execute unwanted actions on a web application where they're authenticated. Rails protects against CSRF attacks by including a token in every form and verifying this token on form submission.\n\nHow it works:\n\n1. Rails generates a unique CSRF token for each user session\n2. The token is included in forms via the `form_authenticity_token` helper:\n\n```erb\n<%= form_for @user do |f| %>\n  <!-- Rails automatically includes the authenticity token -->\n  <%= f.text_field :name %>\n  <%= f.submit %>\n<% end %>\n```\n\n3. For non-GET AJAX requests, Rails stores the token in a header:\n\n```javascript\n// Rails automatically adds this with jQuery UJS or importmap setup\nheaders: {\n  'X-CSRF-Token': document.querySelector('meta[name=\"csrf-token\"]').content\n}\n```\n\n4. The `protect_from_forgery` method in ApplicationController enables this protection:\n\n```ruby\nclass ApplicationController < ActionController::Base\n  protect_from_forgery with: :exception\nend\n```\n\nThis ensures that only requests with valid tokens are processed.",
        category: "Security",
        difficulty: "intermediate",
      },
    ];
    
    questionsData.forEach(question => {
      this.createQuestion(question);
    });
  }
}

export const storage = new MemStorage();
