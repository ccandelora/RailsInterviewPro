import { questions, userPreferences, users, type User, type InsertUser, type Question, type InsertQuestion, type UserPreference, type InsertUserPreference } from "@shared/schema";
import { DBStorage } from './db-storage';

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Question methods
  getAllQuestions(): Promise<Question[]>;
  getQuestionsByDifficulty(difficulty: string): Promise<Question[]>;
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
  
  async getQuestionsByDifficulty(difficulty: string): Promise<Question[]> {
    const questions = Array.from(this.questionsList.values());
    return questions.filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase());
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
        isFavorite: preference.isFavorite ?? false,
        isCompleted: preference.isCompleted ?? false
      };
      this.userPrefs.set(existingPref.id, updatedPref);
      return updatedPref;
    } else {
      // Create new preference
      const id = this.prefId++;
      const newPref: UserPreference = { 
        ...preference, 
        id,
        isFavorite: preference.isFavorite ?? false,
        isCompleted: preference.isCompleted ?? false
      };
      this.userPrefs.set(id, newPref);
      return newPref;
    }
  }
  
  private seedQuestions(): void {
    const questionsData: InsertQuestion[] = [
      // EASY QUESTIONS
      {
        question: "What is Ruby on Rails?",
        difficulty: "easy",
        category: "Basics",
        answer: "Ruby on Rails (Rails) is an open-source web application framework written in Ruby that follows the MVC (Model-View-Controller) architectural pattern. It emphasizes Convention over Configuration and DRY (Don't Repeat Yourself) principles to increase developer productivity."
      },
      {
        question: "Explain MVC architecture in Rails",
        difficulty: "easy",
        category: "Architecture",
        answer: "MVC stands for Model-View-Controller, an architectural pattern used in Rails. Models handle data and business logic, Views handle the user interface and presentation, and Controllers handle incoming requests, interact with models, and render views."
      },
      {
        question: "What is the difference between render and redirect_to in Rails?",
        difficulty: "easy",
        category: "Controllers",
        answer: "render displays a view without making a new request, preserving the current request's variables. redirect_to sends a new HTTP request to a different URL, effectively starting a new request/response cycle."
      },
      {
        question: "What are migrations in Rails?",
        difficulty: "easy",
        category: "Database",
        answer: "Migrations are Ruby classes that create or modify database tables in a structured and organized way. They allow for version control of database schema changes and make it easy to apply or roll back changes."
      },
      {
        question: "Explain the Rails request lifecycle",
        difficulty: "easy",
        category: "Architecture",
        answer: "1) Browser sends request to server. 2) Router determines which controller and action to use. 3) Controller processes the request, interacts with models if needed. 4) Controller renders a view or redirects. 5) Server sends response back to browser."
      },
      {
        question: "What are helpers in Rails and why are they useful?",
        difficulty: "easy",
        category: "Views",
        answer: "Helpers are modules that provide methods to assist with view rendering. They help keep views clean by moving complex logic or repetitive code out of the view and into organized helper modules."
      },
      {
        question: "What is bundler and what problem does it solve?",
        difficulty: "easy",
        category: "Gems",
        answer: "Bundler is a dependency manager for Ruby projects. It resolves, installs, and tracks gem dependencies, ensuring the same versions are used across all environments, solving the 'dependency hell' problem."
      },
      {
        question: "What is asset pipeline in Rails?",
        difficulty: "easy",
        category: "Frontend",
        answer: "The asset pipeline provides a framework to concatenate, minify, and compress JavaScript and CSS assets. It also adds asset fingerprinting for cache optimization. In Rails 6+, it's largely replaced by Webpacker/esbuild for JavaScript assets."
      },
      
      // MEDIUM QUESTIONS
      {
        question: "Explain the different types of associations in Rails",
        difficulty: "medium",
        category: "ActiveRecord",
        answer: "Rails supports has_one, has_many, belongs_to, has_many :through, has_one :through, and has_and_belongs_to_many associations. These define relationships between models: one-to-one, one-to-many, and many-to-many connections."
      },
      {
        question: "What are scopes in ActiveRecord and how do you use them?",
        difficulty: "medium",
        category: "ActiveRecord",
        answer: "Scopes are reusable query fragments defined in models using the 'scope' method. Example: 'scope :active, -> { where(active: true) }'. They help in creating readable, reusable query logic that can be chained."
      },
      {
        question: "Explain ActiveRecord callbacks and name a few",
        difficulty: "medium",
        category: "ActiveRecord",
        answer: "Callbacks are methods triggered at certain moments in an object's lifecycle. Examples include before_save, after_create, after_destroy, before_validation. They allow executing code before or after changes to an object's state."
      },
      {
        question: "What is the difference between class methods and instance methods?",
        difficulty: "medium",
        category: "Ruby",
        answer: "Class methods are called on the class itself (defined with 'self.' prefix or inside 'class << self') and operate on the class level. Instance methods are called on instances of a class and operate on individual objects."
      },
      {
        question: "Explain the purpose of the params hash in Rails",
        difficulty: "medium",
        category: "Controllers",
        answer: "The params hash contains all parameters passed in a request (from query strings, form submissions, and route parameters). It allows controllers to access user input safely and can be used with Strong Parameters to control what attributes are allowed."
      },
      {
        question: "What are Strong Parameters in Rails?",
        difficulty: "medium",
        category: "Controllers",
        answer: "Strong Parameters provide a way to whitelist and require specific parameters before they can be used for mass assignment, helping prevent unauthorized attribute setting. They're typically implemented using 'require' and 'permit' methods in controllers."
      },
      {
        question: "Explain the difference between eager loading and lazy loading in Rails",
        difficulty: "medium",
        category: "ActiveRecord",
        answer: "Eager loading (using includes, preload, or eager_load) loads associated records in advance, reducing N+1 query problems. Lazy loading fetches associated records only when they're accessed, which can lead to performance issues if not managed properly."
      },
      {
        question: "What is Turbolinks in Rails and how does it work?",
        difficulty: "medium",
        category: "Frontend",
        answer: "Turbolinks speeds up page navigation by replacing the body and updating the browser history instead of doing full-page reloads. It intercepts link clicks, fetches the new page via AJAX, and swaps content, making navigation feel faster."
      },
      {
        question: "What is Hotwire and how does it differ from traditional Rails approaches?",
        difficulty: "medium",
        category: "Frontend",
        answer: "Hotwire (HTML Over The Wire) is a technique for building interactive web applications without much JavaScript. It consists of Turbo (enhanced Turbolinks) and Stimulus (a lightweight JS framework). It sends HTML instead of JSON and updates pages via DOM merging."
      },
      {
        question: "Explain polymorphic associations in Rails",
        difficulty: "medium",
        category: "ActiveRecord",
        answer: "Polymorphic associations allow a model to belong to more than one type of model through a single association. For example, comments that can belong to either posts or products use 'commentable' polymorphic interface with 'commentable_id' and 'commentable_type' columns."
      },
      
      // HARD QUESTIONS
      {
        question: "Explain CSRF protection in Rails and how it works",
        difficulty: "hard",
        category: "Security",
        answer: "Cross-Site Request Forgery protection in Rails works by including a unique token in forms that is validated when the form is submitted. Rails includes CSRF tokens in meta tags and validates them on non-GET requests, blocking unauthorized cross-site requests."
      },
      {
        question: "Explain metaprogramming in Ruby and provide an example",
        difficulty: "hard",
        category: "Ruby",
        answer: "Metaprogramming is writing code that writes or manipulates code at runtime. Examples include define_method for dynamically creating methods, method_missing for handling calls to undefined methods, and instance_eval for evaluating code in an object's context."
      },
      {
        question: "What are the different ways to set up validations in Rails?",
        difficulty: "hard",
        category: "ActiveRecord",
        answer: "Rails validations can be set up using built-in validation helpers (validates :name, presence: true), custom validation methods (validate :custom_method), custom validator classes, and validation contexts for different validation scenarios."
      },
      {
        question: "Explain the asset precompilation process in Rails",
        difficulty: "hard",
        category: "Deployment",
        answer: "Asset precompilation processes JS, CSS, and other assets by concatenating, minifying, and fingerprinting them for production. The process uses a manifest file to map original filenames to compiled ones. Run with 'rails assets:precompile'."
      },
      {
        question: "What is Rack in Ruby and how does Rails use it?",
        difficulty: "hard",
        category: "Architecture",
        answer: "Rack is a modular interface between web servers and Ruby web frameworks. Rails is built on Rack, which allows middleware to be stacked and provides a common interface. Each middleware component processes requests and responses in sequence."
      },
      {
        question: "Explain memoization and how it's used in Rails",
        difficulty: "hard",
        category: "Performance",
        answer: "Memoization caches the result of a method call to avoid repeated expensive operations. In Rails, it's often implemented using the ||= operator: '@users ||= User.all'. This assigns to @users only if it's nil or false, otherwise returns its current value."
      },
      {
        question: "What are concerns in Rails and when should you use them?",
        difficulty: "hard",
        category: "Architecture",
        answer: "Concerns are modules that extend ActiveSupport::Concern for sharing code between models or controllers. They help organize and reuse code that doesn't fit in inheritance hierarchies. Use them for cross-cutting functionality like taggable or searchable behavior."
      },
      {
        question: "Explain the differences between class_eval, instance_eval, and module_eval",
        difficulty: "hard",
        category: "Ruby",
        answer: "class_eval (alias module_eval) evaluates code in the context of a class/module, allowing new methods definition. instance_eval evaluates code in the context of an object's singleton class. The difference is whether methods are added as instance methods or singleton methods."
      },
      {
        question: "What are N+1 queries and how do you avoid them?",
        difficulty: "hard",
        category: "Performance",
        answer: "N+1 queries occur when you fetch N records and then make one additional query for each record (N+1 total). Avoid them using eager loading with includes, preload, or eager_load, or using the bullet gem to detect them in development."
      },
      {
        question: "Explain background job processing in Rails and compare different solutions",
        difficulty: "hard",
        category: "Architecture",
        answer: "Background jobs process tasks asynchronously outside the request cycle. Rails has Active Job as an abstraction layer. Popular backends include Sidekiq (Redis-based, threaded), DelayedJob (database-backed), Resque (Redis-based, process-based), and Good Job (Postgres-based)."
      },
      {
        question: "What is the asset pipeline in Rails and how does it work?",
        difficulty: "hard",
        category: "Frontend",
        answer: "The asset pipeline concatenates, minifies and compresses JS and CSS assets. It uses Sprockets to manage dependencies, and can transform assets through preprocessors like Sass or CoffeeScript. It adds fingerprints to filenames for cache invalidation."
      },
      {
        question: "How does authentication work in Rails? Compare different authentication strategies",
        difficulty: "hard",
        category: "Security",
        answer: "Authentication verifies user identity. Options include: 1) Devise (full-featured gem with modules), 2) has_secure_password (built-in with bcrypt), 3) OmniAuth (third-party auth), 4) JWT tokens (for APIs), 5) Warden (low-level authentication framework)."
      },
      {
        question: "Explain the differences between STI and polymorphic associations",
        difficulty: "hard",
        category: "ActiveRecord",
        answer: "Single Table Inheritance (STI) puts all subclasses in one table with a type column, sharing the same attributes. Polymorphic associations allow a model to belong to different models, using *_type and *_id columns. STI is about inheritance; polymorphic is about relationships."
      },
      {
        question: "How does caching work in Rails? Explain different caching strategies",
        difficulty: "hard",
        category: "Performance",
        answer: "Rails supports: 1) Page caching (full HTML pages), 2) Action caching (controller actions with filters), 3) Fragment caching (view partials), 4) Russian Doll caching (nested fragments), 5) Low-level caching (custom keys), and 6) HTTP caching (ETags, Last-Modified headers)."
      },

      // ADDITIONAL EASY QUESTIONS
      {
        question: "What is a gem in Ruby?",
        difficulty: "easy",
        category: "Gems",
        answer: "A gem is a packaged library or application that can be installed with the RubyGems package manager. Gems provide specific functionality to Ruby applications. Rails itself is a gem, and Rails applications typically use many gems for features like authentication, payment processing, and file uploading."
      },
      {
        question: "What is the purpose of the Gemfile in a Rails application?",
        difficulty: "easy",
        category: "Gems",
        answer: "The Gemfile is a Ruby file that specifies the gems required by your Rails application. It's used by Bundler to manage gem dependencies, ensuring all required gems are installed and that the proper versions are used. The Gemfile.lock file records the exact versions installed."
      },
      {
        question: "What does 'Convention over Configuration' mean in Rails?",
        difficulty: "easy",
        category: "Basics",
        answer: "Convention over Configuration is a design paradigm that prioritizes following established naming and structural conventions rather than requiring explicit configuration. Rails uses conventions for file locations, class/table names, and more, which reduces the amount of code needed to get things working."
      },
      {
        question: "What is the purpose of the routes.rb file in Rails?",
        difficulty: "easy",
        category: "Routing",
        answer: "The routes.rb file defines the URL routes for your Rails application. It maps URLs to controller actions and determines the hierarchy of your application's endpoints. It also establishes named routes that can be used in controllers and views."
      },
      {
        question: "What are partials in Rails views?",
        difficulty: "easy",
        category: "Views",
        answer: "Partials are reusable view snippets that help keep your view code DRY (Don't Repeat Yourself). They're stored as separate files with names starting with an underscore (e.g., _form.html.erb) and can be rendered within other views using the 'render' method."
      },
      {
        question: "What is the purpose of the application.rb file in Rails?",
        difficulty: "easy",
        category: "Configuration",
        answer: "The application.rb file contains configuration settings that apply to the entire Rails application. It includes middleware configuration, autoloading paths, time zone settings, and other application-wide configurations. It's where you set Rails framework defaults and configure application behavior."
      },
      {
        question: "What are flash messages in Rails?",
        difficulty: "easy",
        category: "Controllers",
        answer: "Flash messages are temporary messages that are stored in the session for the next request only. They're commonly used to display success or error notifications after a redirect. The flash hash provides :notice and :alert as standard keys, but you can use custom keys as well."
      },
      {
        question: "What is turbolinks in Rails?",
        difficulty: "easy",
        category: "Frontend",
        answer: "Turbolinks is a JavaScript library that makes navigating your web application faster. It replaces the full page refresh with partial replacement of the body, maintaining the browser's history and scroll position. This provides a snappier user experience without requiring a single-page application architecture."
      },
      {
        question: "How do you access parameters from a URL or form in Rails?",
        difficulty: "easy",
        category: "Controllers",
        answer: "Parameters from URLs or forms are accessed through the `params` hash in controllers. For example, with a URL like '/users/1', you could access the ID with `params[:id]`. Form data is also automatically added to the params hash, accessible by field name."
      },
      
      // ADDITIONAL MEDIUM QUESTIONS
      {
        question: "What are 'strong parameters' in Rails and why are they important?",
        difficulty: "medium",
        category: "Security",
        answer: "Strong parameters (introduced in Rails 4) provide a way to whitelist parameters coming from user requests, protecting against mass assignment vulnerabilities. They require explicitly permitting parameters using methods like 'permit' and 'require' before they can be used for mass assignment operations."
      },
      {
        question: "What is the difference between 'has_many :through' and 'has_and_belongs_to_many' associations?",
        difficulty: "medium",
        category: "ActiveRecord",
        answer: "Both create many-to-many relationships, but 'has_many :through' uses an explicit join model that can have its own attributes and validations, while 'has_and_belongs_to_many' uses a simple join table with no corresponding model. 'has_many :through' is more flexible and generally preferred for complex relationships."
      },
      {
        question: "What is the Asset Pipeline in Rails?",
        difficulty: "medium",
        category: "Frontend",
        answer: "The Asset Pipeline is a framework for preprocessing, combining, and minifying JavaScript, CSS, and image assets. It helps improve page load times by reducing HTTP requests and file sizes. Key features include asset concatenation, fingerprinting for cache invalidation, and preprocessing with tools like Sass and CoffeeScript."
      },
      {
        question: "What is the difference between 'destroy' and 'delete' in ActiveRecord?",
        difficulty: "medium",
        category: "ActiveRecord",
        answer: "Both remove records, but 'destroy' triggers callbacks and validations, while 'delete' performs a direct SQL DELETE without callbacks. 'destroy' also handles dependent associations according to their configuration (destroy, delete, nullify), whereas 'delete' ignores these settings."
      },
      {
        question: "How do you implement file uploads in Rails?",
        difficulty: "medium",
        category: "Features",
        answer: "Rails offers Active Storage (built-in since Rails 5.2) for file uploads. You can also use gems like CarrierWave or Paperclip. To implement: 1) Configure storage (local, cloud), 2) Add 'has_one_attached' or 'has_many_attached' to models, 3) Add file fields to forms, 4) Handle the file in the controller, 5) Display or process the files as needed."
      },
      {
        question: "What is the difference between 'find', 'find_by', and 'where' in ActiveRecord?",
        difficulty: "medium",
        category: "ActiveRecord",
        answer: "'find' retrieves records by primary key and raises RecordNotFound if not found. 'find_by' finds the first record matching conditions and returns nil if nothing found. 'where' returns a relation (collection) of all matching records, allowing for method chaining. 'where' returns an empty collection if nothing matches."
      },
      {
        question: "What are concerns in Rails and when should you use them?",
        difficulty: "medium",
        category: "Architecture",
        answer: "Concerns are modules that extend ActiveSupport::Concern and provide a way to share code between models or controllers. They help organize and reuse code that doesn't belong in inheritance hierarchies. Use concerns when functionality cuts across multiple models but doesn't represent a full model on its own."
      },
      {
        question: "What is the difference between instance variables, class variables, and class instance variables in Ruby?",
        difficulty: "medium",
        category: "Ruby",
        answer: "Instance variables (@var) belong to specific instances. Class variables (@@var) are shared across all instances and subclasses of a class. Class instance variables (@var defined directly in the class) belong to the class itself but aren't shared with subclasses. Each has different scoping and inheritance rules."
      },
      {
        question: "How do service objects work in Rails?",
        difficulty: "medium",
        category: "Architecture",
        answer: "Service objects encapsulate business logic that doesn't naturally belong in models, views, or controllers. They follow the Single Responsibility Principle, handling one operation like 'CreateUser' or 'ProcessPayment'. While not built into Rails, they're a common pattern for organizing complex logic and keeping models focused on data concerns."
      },
      {
        question: "What are Rails Engines and when would you use them?",
        difficulty: "medium",
        category: "Architecture",
        answer: "Rails Engines are miniature Rails applications that provide functionality to their host applications. They can have their own models, views, controllers, routes, and migrations. Use Engines when you need to: 1) Share code between multiple Rails apps, 2) Create modular features (like admin panels, CMS), 3) Isolate complex functionality."
      },
      {
        question: "How do you handle errors in Rails API responses?",
        difficulty: "medium",
        category: "API",
        answer: "For APIs, use appropriate HTTP status codes (400 for invalid requests, 404 for not found, 422 for validation errors, etc.). Structure error responses consistently, such as: `{\"errors\": [{\"title\": \"Record Invalid\", \"detail\": \"Name can't be blank\"}]}`. Consider using gems like 'jsonapi-rails' for standardized error formats."
      },
      {
        question: "What are ActiveRecord callbacks and what are some best practices for using them?",
        difficulty: "medium",
        category: "ActiveRecord",
        answer: "Callbacks are hooks into the lifecycle of ActiveRecord objects (e.g., before_save, after_create). Best practices include: 1) Avoid complex logic in callbacks, 2) Don't use callbacks for functionality not directly related to the model, 3) Be cautious with after_* callbacks as they may not run if validations fail, 4) Consider service objects for complex operations."
      },
      {
        question: "What is caching in Rails and what are the different caching strategies?",
        difficulty: "medium",
        category: "Performance",
        answer: "Caching improves performance by storing computed results for future requests. Rails offers: 1) Page caching (entire HTML pages), 2) Action caching (controller actions with filters applied), 3) Fragment caching (view partials), 4) Low-level caching (arbitrary data), 5) SQL caching (per-request query results), and 6) ETags and Russian doll caching."
      },
      
      // ADDITIONAL HARD QUESTIONS
      {
        question: "How would you implement a multi-tenant Rails application?",
        difficulty: "hard",
        category: "Architecture",
        answer: "Multi-tenant strategies include: 1) Separate databases (complete isolation, complex setup), 2) Separate schemas in PostgreSQL (good isolation, simpler than separate DBs), 3) Row-level separation with a tenant_id column (simplest setup, careful queries needed). Consider gems like 'apartment' or 'acts_as_tenant'. You'll need request routing to identify the tenant and scoping of all queries."
      },
      {
        question: "Explain the differences between optimistic and pessimistic locking in ActiveRecord",
        difficulty: "hard",
        category: "ActiveRecord",
        answer: "Optimistic locking assumes conflicts are rare and uses a version column to detect conflicts at save time (via ActiveRecord::StaleObjectError). Pessimistic locking locks the database rows during the transaction with 'lock: true' or 'with_lock'. Optimistic is better for most web apps, while pessimistic is for critical data integrity situations."
      },
      {
        question: "How would you debug performance issues in a Rails application?",
        difficulty: "hard",
        category: "Performance",
        answer: "To debug performance: 1) Use rack-mini-profiler or Scout APM to identify slow actions, 2) Check for N+1 queries with bullet gem, 3) Use ActiveRecord's .explain to analyze queries, 4) Profile memory with derailed_benchmarks, 5) Check for slow external service calls, 6) Use flamegraphs to visualize code execution, 7) Analyze full-stack performance with New Relic or Skylight."
      },
      {
        question: "How does the Rails autoloading system work and what are its implications?",
        difficulty: "hard",
        category: "Architecture",
        answer: "Rails autoloading uses constants to load files on demand instead of requiring all files upfront. In development, it uses ActiveSupport::Dependencies for const_missing to load code, while in production it uses eager loading for performance. Implications: file naming/location must follow conventions, circular dependencies can be problematic, and constants can sometimes be unloaded unexpectedly."
      },
      {
        question: "What is Rack middleware and how would you implement a custom middleware in Rails?",
        difficulty: "hard",
        category: "Architecture",
        answer: "Rack middleware forms a stack for processing HTTP requests/responses. To implement: 1) Create a class with initialize(app) and call(env) methods, 2) Place it in lib/ or app/middleware/, 3) Register in config/application.rb using `config.middleware.use YourMiddleware, options`. Middleware can modify request/response, implement cross-cutting concerns like logging, or terminate the request cycle."
      },
      {
        question: "What strategies would you use to handle background processing in a Rails application?",
        difficulty: "hard",
        category: "Architecture",
        answer: "For background jobs: 1) Use ActiveJob as the interface, 2) Choose a backend like Sidekiq (Redis-based, threaded), DelayedJob (database-backed), or Resque (Redis, process-based), 3) Design retry strategies and error handling, 4) Consider job priority, scheduling, and concurrency limits, 5) Implement monitoring and dead job handling, 6) Use background jobs for emails, notifications, and resource-intensive tasks."
      },
      {
        question: "How would you implement real-time features in a Rails application?",
        difficulty: "hard",
        category: "Architecture",
        answer: "For real-time features: 1) Use Action Cable (WebSockets) for persistent connections, 2) Consider Hotwire (Turbo Streams) for simpler implementations, 3) Implement a pub/sub system with Redis, 4) Use background jobs to process events, 5) For high-scale needs, consider separate services like Elixir/Phoenix or Node.js with message brokers (RabbitMQ, Kafka), 6) Consider SaaS alternatives like Pusher or Ably."
      },
      {
        question: "How do you ensure database migrations are zero-downtime in Rails?",
        difficulty: "hard",
        category: "Deployment",
        answer: "For zero-downtime migrations: 1) Split schema changes from data changes, 2) Add columns as nullable first, then populate, then add constraints, 3) Create tables and indexes with 'IF NOT EXISTS', 4) Use 'CONCURRENTLY' for index creation in PostgreSQL, 5) Avoid long-running migrations in a single deploy, 6) Test migration timing on production-sized data, 7) Consider tools like strong_migrations gem, 8) Use database load balancing if needed."
      },
      {
        question: "What are the security considerations for a Rails application?",
        difficulty: "hard",
        category: "Security",
        answer: "Rails security considerations: 1) Keep gems updated (especially Rails), 2) Configure proper CSRF protection, 3) Use strong parameters to prevent mass assignment vulnerabilities, 4) Validate all inputs and sanitize outputs, 5) Use auth gems like Devise securely, 6) Implement proper authorization with Pundit or CanCanCan, 7) Set secure HTTP headers with secure_headers gem, 8) Implement rate limiting, 9) Use security scanners like Brakeman."
      },
      {
        question: "Explain the use of STI (Single Table Inheritance) vs. polymorphic associations",
        difficulty: "hard",
        category: "ActiveRecord",
        answer: "STI uses one table for multiple subclasses with a 'type' column, appropriate when models share most attributes and behavior. Polymorphic associations allow relationships to multiple models using *_type and *_id columns, useful for shared relationships (comments, tags). STI provides clean inheritance but can lead to sparse tables; polymorphic associations offer flexibility but add query complexity."
      },
      {
        question: "How would you implement a RESTful API in Rails with proper versioning?",
        difficulty: "hard",
        category: "API",
        answer: "For versioned APIs: 1) Use namespaces in routes.rb: `namespace :api do namespace :v1 do ...`, 2) Structure controllers in app/controllers/api/v1/, 3) Implement content negotiation via Accept header or URL path, 4) Use serializers (ActiveModel::Serializers or Fast JSON API) for consistent responses, 5) Maintain compatibility between versions, 6) Document thoroughly with tools like Swagger, 7) Consider using API-specific frameworks like Rails API or Grape."
      },
      {
        question: "What is metaprogramming in Ruby and how can it be used in Rails?",
        difficulty: "hard",
        category: "Ruby",
        answer: "Metaprogramming is writing code that writes or manipulates code at runtime. In Rails, it's used for: 1) Dynamic method definition (define_method in ActiveRecord), 2) Method missing hooks (respond_to dynamic finders), 3) Class macros (has_many, validates), 4) Extending classes at runtime, 5) Domain-specific languages. While powerful, it should be used judiciously as it can make code harder to understand and debug."
      },
      {
        question: "How would you implement efficient database queries for reports and analytics in Rails?",
        difficulty: "hard",
        category: "Performance",
        answer: "For analytics queries: 1) Use raw SQL or Arel for complex queries, 2) Implement database views for common queries, 3) Consider read replicas for reporting workloads, 4) Use batch processing for large datasets, 5) Implement materialized views in PostgreSQL for cached results, 6) Consider data warehousing solutions for complex analytics, 7) Use counter caches for common counts, 8) Index strategically based on query patterns."
      },
      {
        question: "Explain the Rails boot process and how to optimize it",
        difficulty: "hard",
        category: "Performance",
        answer: "The Rails boot process: 1) Loads Ruby interpreter, 2) Requires gems, 3) Loads Rails framework, 4) Loads application code, 5) Initializes application. To optimize: 1) Use bootsnap gem for caching, 2) Remove unused gems, 3) Use spring or zeus for development, 4) Configure eager loading carefully, 5) Profile with rack-mini-profiler or stackprof, 6) Use zeitwerk mode for class loading, 7) Consider incremental boot in Rails 7+."
      },
      
      // TESTING QUESTIONS
      {
        question: "What is TDD and how is it practiced in Rails development?",
        difficulty: "medium",
        category: "Testing",
        answer: "Test-Driven Development (TDD) follows a Red-Green-Refactor cycle: write a failing test, implement code to make it pass, then refactor. In Rails, TDD typically uses testing frameworks like RSpec or Minitest. You would start with model tests for validations and methods, write controller tests for actions, and create integration tests for user workflows, all before implementing the actual functionality."
      },
      {
        question: "What's the difference between unit, functional, and integration tests in Rails?",
        difficulty: "medium",
        category: "Testing",
        answer: "Unit tests focus on testing individual components in isolation (typically models and their methods). Functional tests (controller tests) verify controller actions, ensuring they render correct views and assign proper variables. Integration tests span multiple controllers and simulate user interaction to test complete workflows across the application."
      },
      {
        question: "How do fixtures, factories, and fakers differ in Rails testing?",
        difficulty: "medium",
        category: "Testing",
        answer: "Fixtures are static YAML files loaded into the test database before tests run, providing consistent but inflexible test data. Factories (using FactoryBot/FactoryGirl) programmatically create test objects, allowing for more flexibility and relationships. Faker generates random realistic data (names, emails, etc.) to populate factories or for direct use in tests."
      },
      {
        question: "What is Capybara and how is it used in Rails testing?",
        difficulty: "medium",
        category: "Testing",
        answer: "Capybara is a testing library that simulates user interactions with your web application. It provides an API for navigating, filling in forms, clicking buttons, and asserting content. Capybara can use different drivers (Selenium, Rack::Test) to either test headlessly or with a real browser. It's commonly used for integration tests and feature specs in RSpec."
      },
      {
        question: "What are stubs, mocks, and spies in testing?",
        difficulty: "hard",
        category: "Testing",
        answer: "Stubs replace methods with predefined responses to isolate tests from external dependencies. Mocks are similar but also set expectations about how they should be called (verifying behavior). Spies record method calls without changing behavior and allow verification afterward. In RSpec, use allow() for stubbing, expect().to receive() for mocking, and have_received() for spying."
      },
      
      // RUBY LANGUAGE QUESTIONS
      {
        question: "What are blocks, procs, and lambdas in Ruby?",
        difficulty: "medium",
        category: "Ruby",
        answer: "Blocks are anonymous functions passed to methods using do..end or {} syntax. Procs are objects that store blocks (callable with call). Lambdas are special Procs with strict argument checking. Key differences: lambdas check argument count (Procs don't); return in a lambda returns from the lambda, while return in a Proc returns from the enclosing method."
      },
      {
        question: "What is the difference between public, protected, and private methods in Ruby?",
        difficulty: "medium",
        category: "Ruby",
        answer: "Public methods can be called by anyone. Protected methods can be called by instances of the same class or subclasses, and can accept other instances of the same class as implicit receivers. Private methods can only be called within the context of the current object (no explicit receiver). All three control the interface and encapsulation of your objects."
      },
      {
        question: "How do you handle exceptions in Ruby?",
        difficulty: "medium",
        category: "Ruby",
        answer: "Use begin/rescue blocks: begin; risky_code; rescue ExceptionType => e; handle_exception; else; no_exception_code; ensure; always_runs_code; end. Custom exceptions can be created by inheriting from StandardError. Use rescue in method definitions without begin. Always rescue specific exceptions rather than generic Exception, and ensure critical cleanup happens in ensure blocks."
      },
      {
        question: "What are eigenclasses (singleton classes) in Ruby?",
        difficulty: "hard",
        category: "Ruby",
        answer: "Eigenclasses are hidden classes associated with specific objects that hold methods defined only for that specific object (singleton methods). They're accessed using class << object notation. This is how Ruby implements class methods (which are singleton methods on the Class object) and allows per-object method definitions without affecting other instances of the same class."
      },
      {
        question: "How does Ruby's garbage collection work?",
        difficulty: "hard",
        category: "Ruby",
        answer: "Ruby uses a mark-and-sweep garbage collector. It periodically: 1) Pauses execution (stop-the-world), 2) Marks objects reachable from root objects, 3) Sweeps away unmarked objects. Modern Ruby (2.0+) uses generational GC which separates objects into young and old spaces for more efficient collection. Ruby 3.0+ implements partial GC compaction to reduce memory fragmentation."
      },

      // NEW RAILS FEATURES - EASY
      {
        question: "What is Hotwire in Rails 7?",
        difficulty: "easy",
        category: "Modern Rails",
        answer: "Hotwire is the default frontend stack in Rails 7, consisting of three main components: Turbo (for SPA-like behavior without much JavaScript), Stimulus (a minimal JavaScript framework for adding behavior), and Strada (for native mobile app integrations). It enables building modern, responsive interfaces with minimal JavaScript."
      },
      {
        question: "What is importmap-rails in Rails 7?",
        difficulty: "easy",
        category: "Modern Rails",
        answer: "Import maps in Rails 7 allow you to import JavaScript modules directly from CDNs or your app without using a bundler like Webpack. It uses the browser's native ES modules system, making the setup simpler and faster. It's defined in config/importmap.rb and allows pinning specific versions of JavaScript libraries."
      },
      {
        question: "What is Action Text in modern Rails?",
        difficulty: "easy",
        category: "Modern Rails",
        answer: "Action Text is a framework introduced in Rails 6 that provides rich text editing capabilities. It integrates the Trix editor and handles file uploads through Active Storage. It allows developers to easily add rich text fields to their models with the 'has_rich_text' method."
      },
      {
        question: "What is Active Storage and how is it used?",
        difficulty: "easy",
        category: "Modern Rails",
        answer: "Active Storage, introduced in Rails 5.2, facilitates file uploads to cloud storage services like Amazon S3, Google Cloud Storage, or Microsoft Azure Storage, with local disk-based storage for development. It provides one-line attachments in models (has_one_attached, has_many_attached), automatic image variants, and direct uploads from browsers to cloud storage."
      },
      {
        question: "What is Turbo Drive in Rails?",
        difficulty: "easy",
        category: "Modern Rails",
        answer: "Turbo Drive (part of Hotwire) accelerates page navigation by converting link clicks and form submissions into AJAX requests. It replaces the full page refresh with surgical page updates, preserving the scroll position and maintaining a single JavaScript context, resulting in faster navigation without building a single-page application."
      },
      
      // NEW RAILS FEATURES - MEDIUM
      {
        question: "How do Turbo Frames work in modern Rails?",
        difficulty: "medium",
        category: "Modern Rails",
        answer: "Turbo Frames allow you to update specific parts of a page without a full reload. Each frame is a self-contained context for navigation, with links causing only the frame's content to update. They are defined with <turbo-frame> tags with unique IDs. When a link inside a frame is clicked, Turbo fetches the matching frame from the response and swaps only that content."
      },
      {
        question: "What is the difference between Turbo Streams and Turbo Frames?",
        difficulty: "medium",
        category: "Modern Rails",
        answer: "Turbo Frames update a single part of a page via navigation, while Turbo Streams deliver page changes over WebSocket, SSE, or in response to form submissions. Frames are defined with <turbo-frame> tags and update through normal navigation, while Streams use <turbo-stream> elements with actions like append, prepend, replace, update, remove to make surgical DOM changes."
      },
      {
        question: "How does Stimulus.js work with Rails?",
        difficulty: "medium",
        category: "Modern Rails",
        answer: "Stimulus is a modest JavaScript framework that connects HTML controllers to DOM elements using data attributes. In Rails, it's part of the Hotwire stack. Controllers are JavaScript classes with methods that respond to DOM events. You connect HTML elements with controllers using data-controller, data-action, and data-[controller]-[value] attributes, maintaining a clear separation between HTML and behavior."
      },
      {
        question: "What is Action Mailbox in Rails 6+?",
        difficulty: "medium", 
        category: "Modern Rails",
        answer: "Action Mailbox, introduced in Rails 6, routes incoming emails to controller-like mailboxes for processing. It integrates with major email providers (SendGrid, Mailgun, etc.) and provides an inbox for storing inbound emails. It's useful for creating support ticket systems, discussion forums via email, or any feature that responds to incoming emails."
      },
      {
        question: "How does Rails 7 handle JavaScript bundling compared to earlier versions?",
        difficulty: "medium",
        category: "Modern Rails",
        answer: "Rails 7 offers several approaches to JavaScript: 1) Import maps for using JavaScript modules without bundling, 2) jsbundling-rails for integrating with esbuild, rollup.js, or webpack, 3) Hotwire to minimize JavaScript needs altogether. This contrasts with Rails 6 which relied primarily on Webpacker. The goal is more flexibility and simpler defaults with import maps."
      },
      {
        question: "What is the purpose of ActiveStorage variants?",
        difficulty: "medium",
        category: "Modern Rails",
        answer: "ActiveStorage variants allow you to create different versions of image attachments for different contexts (thumbnails, previews, etc.). They're defined with variant methods: image.variant(resize_to_limit: [100, 100]).processed. Rails uses image processing libraries (ImageMagick/libvips) to create these variants on-demand and caches the results for performance."
      },
      {
        question: "How do you implement real-time features with Turbo Streams?",
        difficulty: "medium",
        category: "Modern Rails",
        answer: "To implement real-time features with Turbo Streams: 1) Set up Action Cable, 2) Create a Turbo::StreamsChannel, 3) Broadcast updates using stream_for or stream_from in your models or controllers (e.g., Turbo::StreamsChannel.broadcast_append_to), 4) Subscribe to these streams with <turbo-stream-source> tags or the Turbo.subscribeTo method in your views."
      },
      {
        question: "What are importmaps in Rails 7 and how do they differ from JavaScript bundlers?",
        difficulty: "medium",
        category: "Modern Rails",
        answer: "Importmaps in Rails 7 allow you to use ESM imports directly in the browser without bundling. Unlike bundlers (webpack/esbuild) that process and package JS files, importmaps just map import statements to URLs. Benefits include simpler setup, no build step, and faster development cycles. Drawbacks include no code transformation (no TypeScript/Babel) and potentially more HTTP requests in production."
      },
      
      // NEW RAILS FEATURES - HARD
      {
        question: "What is the purpose of Kredis in Rails 7 and how does it work?",
        difficulty: "hard",
        category: "Modern Rails",
        answer: "Kredis (Keyed Redis) provides higher-level data structures on top of Redis in Rails 7. It offers a simple interface for common Redis use cases like counters, flags, lists, and unique sets without dealing with low-level Redis commands. It's configured in config/redis/*.yml and used with kredis declarations in models: has_many_cached :items, through: :kredis_list. It's useful for volatile data that doesn't need persistence."
      },
      {
        question: "How does Rails 7 handle CSS bundling and what options are available?",
        difficulty: "hard",
        category: "Modern Rails",
        answer: "Rails 7 offers multiple approaches for CSS: 1) cssbundling-gem for integrating with PostCSS, Tailwind, Bootstrap, Bulma, etc., 2) Tailwind via the tailwindcss-rails gem with standalone CLI, 3) The asset pipeline with Sprockets or Propshaft, 4) The new default of importing CSS from npm packages via importmaps. This provides more flexibility than the previous Webpacker approach."
      },
      {
        question: "Explain how encrypted attributes work in Rails 7",
        difficulty: "hard",
        category: "Modern Rails",
        answer: "Encrypted attributes in Rails 7 (ActiveRecord::Encryption) provide database-level encryption for sensitive data. Configure in config/credentials with deterministic/non-deterministic options, key derivation, and key rotation settings. Use with 'encrypts :email, deterministic: true' in models. It handles encryption/decryption automatically, supports different encryption schemes per attribute, and includes key rotation capabilities."
      },
      {
        question: "What is Hotwire Turbo Native and how does it integrate with mobile apps?",
        difficulty: "hard",
        category: "Modern Rails",
        answer: "Turbo Native extends Hotwire to native iOS/Android apps through WebViews. It provides native adapters that intercept link clicks and form submissions within the WebView and handle them through native controllers. This allows hybrid apps where parts are native and others are web-based, sharing code between web and mobile. For deep integration, it uses URL-based routing schemes to coordinate between web and native components."
      },
      {
        question: "How do you set up Action Cable for real-time features in Rails?",
        difficulty: "hard",
        category: "Modern Rails",
        answer: "To set up Action Cable: 1) Configure Redis in cable.yml, 2) Create a channel with 'rails g channel Room', 3) Define subscribed/unsubscribed methods and custom actions, 4) Add a stream_from to subscribe to broadcasts, 5) Use ActionCable.server.broadcast to send messages, 6) Set up client-side with import { createConsumer } from '@rails/actioncable', 7) Subscribe with consumer.subscriptions.create() in JavaScript, 8) Handle received data in the client subscription."
      },
      {
        question: "What are the new caching improvements in Rails 7?",
        difficulty: "hard",
        category: "Modern Rails",
        answer: "Rails 7 improves caching with: 1) Cache Versioning (automatic cache key namespacing by Rails version), 2) New ActiveSupport::Cache::Store APIs with support for :counter and :incrementer types, 3) Better Redis cache store with configurable reconnection and error handling, 4) Fragment cache collection rendering with enhanced performance, 5) Better cache key generation with new cache_key_with_version method, 6) Improved cache expiration controls."
      },
      {
        question: "Explain how parallel testing works in modern Rails",
        difficulty: "hard",
        category: "Modern Rails",
        answer: "Rails 6+ supports parallel testing through the ParallelTests module. Configure with 'parallelize(workers: :number_of_processors)' in test_helper.rb. It creates separate database for each process, splits tests across processes, and merges results. Each process runs in isolation with its own database connection pool. Rails handles database creation/migration automatically for each process. For system tests, it coordinates browsers to avoid port conflicts."
      },
      {
        question: "What is Propshaft and how does it differ from Sprockets in Rails 7?",
        difficulty: "hard",
        category: "Modern Rails",
        answer: "Propshaft is Rails 7's alternative asset pipeline that's simpler than Sprockets. Key differences: 1) No asset processing/transformation (delegates to appropriate tools), 2) No manifest format (uses directory structure), 3) Simpler fingerprinting, 4) No runtime JavaScript evaluation, 5) Faster compilation. It's more aligned with modern web development practices, focusing only on serving and fingerprinting pre-compiled assets."
      },
      {
        question: "How does Rails 7 handle database-level encryption?",
        difficulty: "hard",
        category: "Modern Rails",
        answer: "Rails 7 introduces ActiveRecord::Encryption for database-level encryption. Configure it in credentials.yml.enc with primary, deterministic, and key derivation keys. In models, use 'encrypts :attribute' with options like deterministic: true for searchable fields. It supports key rotation, different encryption schemes per attribute, and context-based encryption. Data is transparently encrypted in the database but available as plaintext in your application code."
      },
      {
        question: "How do HTTP/2 Early Hints work in Rails 7?",
        difficulty: "hard",
        category: "Modern Rails",
        answer: "Early Hints (HTTP 103) in Rails 7 improves performance by sending resource hints before the full response. Configure with config.early_hints = true and a compatible server (like H2O with nginx). Rails automatically sends Link headers for CSS/JS assets referenced in the view before the full page is rendered. This lets browsers preload resources while the server completes page generation, especially valuable for database-heavy pages."
      },
      {
        question: "What is the zeitwerk autoloading mode in Rails 6+ and how does it differ from classic mode?",
        difficulty: "hard",
        category: "Modern Rails",
        answer: "Zeitwerk is Rails 6+'s code autoloader that replaces the classic autoloader. Key differences: 1) It's based on filenames mapping exactly to constants (no explicit require), 2) Uses real Ruby constants instead of ActiveSupport::Dependencies, 3) Supports explicit namespaces, 4) Provides better error messages for missing constants, 5) Enables eager loading in development (improving bootup performance), 6) Removes the need for require_dependency, 7) Supports reloading without Spring."
      }
    ];
    
    questionsData.forEach(question => {
      this.createQuestion(question);
    });
  }
}

// Use DBStorage if DATABASE_URL is available, otherwise fallback to MemStorage
let storage: IStorage;

try {
  // Check if DATABASE_URL is available
  if (process.env.DATABASE_URL) {
    console.log('Using database-backed storage');
    storage = new DBStorage();
  } else {
    console.log('DATABASE_URL not available, using in-memory storage');
    storage = new MemStorage();
  }
} catch (error) {
  console.error('Error initializing database storage:', error);
  console.log('Falling back to in-memory storage');
  storage = new MemStorage();
}

export { storage };
