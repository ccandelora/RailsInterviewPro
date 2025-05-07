import { eq, and } from 'drizzle-orm';
import { db, dbTables } from './database';
import { type User, type InsertUser, type Question, type InsertQuestion, type UserPreference, type InsertUserPreference } from "@shared/schema";
import { IStorage } from './storage';

export class DBStorage implements IStorage {
  
  constructor() {
    // Initialize with questions if needed
    this.ensureQuestions();
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const users = await db.select().from(dbTables.users).where(eq(dbTables.users.id, id));
    return users[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const users = await db.select().from(dbTables.users).where(eq(dbTables.users.username, username));
    return users[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(dbTables.users).values(user).returning();
    return result[0];
  }
  
  // Question methods
  async getAllQuestions(): Promise<Question[]> {
    return db.select().from(dbTables.questions);
  }
  
  async getQuestionsByDifficulty(difficulty: string): Promise<Question[]> {
    const questions = await db.select().from(dbTables.questions);
    return questions.filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase());
  }
  
  async getQuestionById(id: number): Promise<Question | undefined> {
    const questions = await db.select().from(dbTables.questions).where(eq(dbTables.questions.id, id));
    return questions[0];
  }
  
  async createQuestion(question: InsertQuestion): Promise<Question> {
    const result = await db.insert(dbTables.questions).values(question).returning();
    return result[0];
  }
  
  // User Preferences methods
  async getUserPreferences(userId: number): Promise<UserPreference[]> {
    return db.select()
      .from(dbTables.userPreferences)
      .where(eq(dbTables.userPreferences.userId, userId));
  }
  
  async updateUserPreference(preference: InsertUserPreference): Promise<UserPreference> {
    // Check if preference already exists
    const existingPrefs = await db.select()
      .from(dbTables.userPreferences)
      .where(
        and(
          eq(dbTables.userPreferences.userId, preference.userId),
          eq(dbTables.userPreferences.questionId, preference.questionId)
        )
      );
    
    const existingPref = existingPrefs[0];
    
    if (existingPref) {
      // Update existing preference
      const updated = await db.update(dbTables.userPreferences)
        .set({
          isFavorite: preference.isFavorite ?? existingPref.isFavorite,
          isCompleted: preference.isCompleted ?? existingPref.isCompleted
        })
        .where(eq(dbTables.userPreferences.id, existingPref.id))
        .returning();
      
      return updated[0];
    } else {
      // Create new preference
      const created = await db.insert(dbTables.userPreferences)
        .values({
          userId: preference.userId,
          questionId: preference.questionId,
          isFavorite: preference.isFavorite ?? false,
          isCompleted: preference.isCompleted ?? false
        })
        .returning();
      
      return created[0];
    }
  }
  
  // Private methods
  private async ensureQuestions(): Promise<void> {
    // Check if questions exist
    const existingQuestions = await db.select().from(dbTables.questions);
    
    // Only seed if no questions exist
    if (existingQuestions.length === 0) {
      console.log('Seeding questions into database...');
      await this.seedQuestions();
    }
  }
  
  private async seedQuestions(): Promise<void> {
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
      {
        question: "What is a gem in Ruby?",
        difficulty: "easy",
        category: "Gems",
        answer: "A gem is a packaged library or plugin that extends the functionality of Ruby applications. Gems are included in projects via the Gemfile, allowing developers to easily add features like authentication, image processing, or API integration."
      },
      {
        question: "How does routing work in Rails?",
        difficulty: "easy",
        category: "Routing",
        answer: "Routing in Rails connects incoming requests with controllers and actions based on URL patterns defined in the config/routes.rb file. This allows for clean URL management within applications, mapping specific URLs to the appropriate controller actions."
      },
      {
        question: "What is the purpose of the rails db:seed task?",
        difficulty: "easy",
        category: "Database",
        answer: "The rails db:seed task is used to populate the database with initial data by executing the code in the db/seeds.rb file. It's useful for setting up test data or initial configuration data for applications."
      },
      {
        question: "How is CSRF protection implemented in Rails?",
        difficulty: "easy",
        category: "Security",
        answer: "Rails implements CSRF protection by including a unique token in forms that is validated on submission. This token is automatically included in forms created with Rails form helpers and is verified on non-GET requests to prevent cross-site request forgery attacks."
      },
      {
        question: "What is the difference between false and nil in Ruby?",
        difficulty: "easy",
        category: "Ruby",
        answer: "In Ruby, false is a boolean value (instance of FalseClass) that represents logical false, while nil (instance of NilClass) represents the absence of any value. Both are considered falsey in conditional statements, but they are different objects with different purposes."
      },
      {
        question: "What is the difference between String and Symbol in Ruby?",
        difficulty: "easy",
        category: "Ruby",
        answer: "Strings are mutable sequences of characters while Symbols are immutable, lightweight objects often used as identifiers. Symbols are prefixed with a colon (:) and are more memory-efficient for keys in hashes because identical symbols refer to the same object in memory."
      },
      {
        question: "Explain the naming convention in Rails",
        difficulty: "easy",
        category: "Conventions",
        answer: "Rails follows conventions like: model names are singular and CamelCased (User), table names are plural and snake_cased (users), controller names are plural and CamelCased (UsersController), and file names are snake_cased. These conventions enable 'Convention over Configuration'."
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
      {
        question: "What is ORM in Rails?",
        difficulty: "medium",
        category: "ActiveRecord",
        answer: "ORM (Object-Relational Mapping) is a technique that connects application objects to database tables. In Rails, ActiveRecord is the ORM layer that allows developers to interact with the database using Ruby methods instead of SQL, mapping tables to classes and rows to objects."
      },
      {
        question: "How do you implement authentication in Rails?",
        difficulty: "medium",
        category: "Security",
        answer: "Authentication in Rails can be implemented using libraries like Devise or has_secure_password. Devise offers full-featured authentication with various modules, while has_secure_password provides basic password encryption and validation using bcrypt."
      },
      {
        question: "What is the difference between ActiveRecord and ActiveModel?",
        difficulty: "medium",
        category: "Architecture",
        answer: "ActiveRecord connects classes to database tables and provides ORM functionality. ActiveModel provides modules for building custom models without a database, offering features like validations and callbacks. ActiveRecord includes ActiveModel, adding database persistence."
      },
      {
        question: "How do you handle file uploads in Rails?",
        difficulty: "medium",
        category: "Features",
        answer: "File uploads in Rails can be handled with libraries like Active Storage (built-in since Rails 5.2), Carrierwave, or Paperclip. Active Storage provides file uploads, storage, and transformations with cloud storage service integrations like Amazon S3 or Google Cloud Storage."
      },
      {
        question: "What is the difference between dynamic and static scaffolding?",
        difficulty: "medium",
        category: "Development",
        answer: "Dynamic scaffolding generates the UI and content at runtime without explicit code generation. Static scaffolding generates actual code files for models, views, and controllers via command line. Static requires database migrations, while dynamic doesn't."
      },
      {
        question: "What is the difference between string and text column types in Rails?",
        difficulty: "medium",
        category: "Database",
        answer: "Both string and text store character data, but string is limited to 255 characters and is better for short content like names or titles, while text can store up to 65,535 characters and is suitable for longer content like descriptions or articles."
      },
      {
        question: "How do you manage database transactions in Rails?",
        difficulty: "medium",
        category: "Database",
        answer: "Database transactions in Rails are managed using ActiveRecord::Base.transaction blocks. If any operation within the block raises an exception, all changes are rolled back, ensuring atomicity. Example: ActiveRecord::Base.transaction do; user.save!; order.save!; end"
      },
      {
        question: "What is the purpose of the ApplicationRecord class in Rails?",
        difficulty: "medium",
        category: "Architecture",
        answer: "ApplicationRecord allows you to centralize configurations that apply to all models in your application. It serves as an abstract base class for all models, making it easier to add application-wide functionality without modifying ActiveRecord::Base directly."
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
      {
        question: "What are the different uses of Ruby modules? Provide examples",
        difficulty: "hard",
        category: "Ruby",
        answer: "Ruby modules serve four main purposes: 1) Traits/Mixins for sharing behavior (Comparable, Enumerable), 2) Namespaces to avoid naming clashes, 3) Singleton alternatives since they can't be instantiated, and 4) Containers for stateless helper methods (Math, FileUtils)."
      },
      {
        question: "How would you flatten a nested hash in Ruby?",
        difficulty: "hard",
        category: "Ruby",
        answer: "To flatten a nested hash like { a: { b: { c: 42 } } } to { a_b_c: 42 }, you can use recursion: lambda do |h, k=''; h.each_with_object({}) do |(key,val),res|; new_key = k.empty? ? key.to_s : \"#{k}_#{key}\"; val.is_a?(Hash) ? res.merge!(lambda.call(val, new_key)) : res[new_key.to_sym] = val; end; end.call(hash)"
      },
      {
        question: "Explain how Rails implements Ajax",
        difficulty: "hard",
        category: "Frontend",
        answer: "Rails implements Ajax through: 1) Unobtrusive JavaScript (UJS) with data-remote attributes on links and forms, 2) Rails UJS library that handles these requests, 3) Controllers responding to different formats (HTML/JS/JSON), 4) JavaScript responses that can update page content without a full reload."
      },
      {
        question: "What happens when you type a URL in the browser and press Enter? Explain the process in Rails context",
        difficulty: "hard",
        category: "Architecture",
        answer: "1) DNS resolves domain to IP, 2) Browser connects to server, 3) Rails router matches the URL pattern, 4) Router dispatches to controller action, 5) Controller interacts with models, 6) Controller renders view or redirects, 7) Response sent back to browser, 8) Browser renders the page."
      },
      {
        question: "What are the limitations of Ruby on Rails?",
        difficulty: "hard",
        category: "Architecture",
        answer: "Rails has limitations including: 1) Performance challenges with high-traffic applications, 2) Boot time and memory usage, 3) Not ideal for applications that don't fit the MVC pattern, 4) Limited support for database sharding, 5) Challenges with truly distributed systems, 6) Documentation can be sparse for advanced features."
      },
      {
        question: "How would you optimize a slow Rails application?",
        difficulty: "hard",
        category: "Performance",
        answer: "To optimize a slow Rails app: 1) Profile with tools like rack-mini-profiler, 2) Optimize database queries (fix N+1, add indices), 3) Implement caching strategies, 4) Use background jobs for time-consuming tasks, 5) Optimize asset delivery, 6) Consider fragment caching for views, 7) Scale horizontally if needed."
      },
      {
        question: "What is the difference between observers and callbacks in Rails?",
        difficulty: "hard",
        category: "Architecture",
        answer: "Callbacks are methods triggered during an object's lifecycle and are defined within the model. Observers are similar but are separate classes that observe models externally. Callbacks are more tightly coupled to models, while observers promote better separation of concerns for cross-cutting concerns."
      },
      // ADDITIONAL ACTIVE RECORD SPECIFIC QUESTIONS
      {
        question: "What is Convention over Configuration in ActiveRecord?",
        difficulty: "medium",
        category: "ActiveRecord",
        answer: "If you follow Rails conventions, you'll need minimal or no configuration when creating ActiveRecord models. Examples include: class names are singular (Post), table names are plural (posts), foreign keys follow pattern singular_model_name_id (post_id), and primary keys are named 'id'."
      },
      {
        question: "What optional reserved column names can you use in ActiveRecord?",
        difficulty: "medium",
        category: "ActiveRecord",
        answer: "ActiveRecord has several special column names with built-in functionality: created_at, updated_at (automatic timestamps), lock_version (optimistic locking), type (for STI), (association_name)_type (polymorphic associations), and (table_name)_count (counter caches)."
      },
      {
        question: "How do you override the table name in ActiveRecord?",
        difficulty: "medium",
        category: "ActiveRecord",
        answer: "To override the default table name in ActiveRecord, use self.table_name = 'custom_table_name' inside your model class. For example: class Product < ApplicationRecord; self.table_name = 'my_products'; end"
      },
      {
        question: "How do you override the primary key in ActiveRecord?",
        difficulty: "medium",
        category: "ActiveRecord",
        answer: "To override the default primary key in ActiveRecord, use self.primary_key = 'custom_primary_key' inside your model class. For example: class Product < ApplicationRecord; self.primary_key = 'product_id'; end"
      },
      {
        question: "What happens if you try to create a column named 'id' which is not the primary key?",
        difficulty: "hard",
        category: "ActiveRecord",
        answer: "Migration will throw an error during migrations with a warning. To create a column named 'id' that's not the primary key, you must use { id: false } in the migration and define your own primary key."
      },
      {
        question: "What is the difference between ActiveRecord's find and find_by methods?",
        difficulty: "medium",
        category: "ActiveRecord",
        answer: "find fetches a record by its primary key (ID) and raises an ActiveRecord::RecordNotFound exception if not found. find_by fetches the first record matching the given conditions and returns nil if not found."
      },
      {
        question: "What is the purpose of the CRUD acronym and how does it relate to ActiveRecord?",
        difficulty: "easy",
        category: "ActiveRecord",
        answer: "CRUD stands for the four basic operations: Create, Read, Update, and Delete. ActiveRecord provides methods for these operations: create/new+save (Create), find/where/all (Read), update/save (Update), and destroy/delete (Delete)."
      },
      {
        question: "What is ActiveRecord in the context of Rails MVC?",
        difficulty: "easy",
        category: "ActiveRecord",
        answer: "ActiveRecord is the M (Model) in the MVC pattern. It's the layer responsible for representing business data and logic, connecting classes to database tables, and enabling operations without writing SQL directly."
      },
      {
        question: "Why is it not recommended to use non-primary key columns named 'id' in ActiveRecord?",
        difficulty: "hard",
        category: "ActiveRecord",
        answer: "Using a column named 'id' that is not the primary key complicates access to its value. The application would have to use the id_value alias attribute to access the non-PK id column's value, creating confusion and potential bugs."
      },
      {
        question: "What does it mean that ActiveRecord migrations are database-agnostic?",
        difficulty: "medium",
        category: "ActiveRecord",
        answer: "It means that migrations written in Ruby can be run against different database systems like MySQL, PostgreSQL, or SQLite without modification. Rails handles translating the Ruby migration code to the appropriate SQL for each database."
      },
      {
        question: "Where does Rails keep track of which migrations have been committed?",
        difficulty: "medium",
        category: "ActiveRecord",
        answer: "Rails keeps track of applied migrations in a table called schema_migrations in the database. This table stores the version numbers of all migrations that have been successfully run."
      },
      {
        question: "How do you run and rollback ActiveRecord migrations?",
        difficulty: "easy",
        category: "ActiveRecord",
        answer: "To run migrations, use 'bin/rails db:migrate'. To roll back the most recent migration, use 'bin/rails db:rollback'. You can also specify how many migrations to roll back with STEP=n (e.g., 'bin/rails db:rollback STEP=3')."
      },
      {
        question: "What are the advantages of using ORM like ActiveRecord?",
        difficulty: "medium",
        category: "ActiveRecord",
        answer: "Advantages include: 1) Less code to write, 2) Faster development time, 3) Reduced development cost, 4) Handles database interaction logic, 5) Improved security through automatic SQL injection protection, and 6) Database independence."
      },
      {
        question: "What are the disadvantages of using ORM like ActiveRecord?",
        difficulty: "medium",
        category: "ActiveRecord",
        answer: "Disadvantages include: 1) Learning curve for new developers, 2) Generally slower than raw SQL for complex queries, 3) Performance issues with very complex or large-scale database operations, and 4) Abstraction can hide important database concepts."
      },
      {
        question: "How do you generate a model with specific attributes using Rails generators?",
        difficulty: "easy",
        category: "ActiveRecord",
        answer: "Use 'rails generate model User name:string email:string'. This creates a model file, migration file, and test files. The migration will include columns for name and email, both of string type."
      },
      {
        question: "What is a join table in Rails and how do you create one?",
        difficulty: "medium",
        category: "ActiveRecord",
        answer: "A join table establishes many-to-many relationships by containing foreign keys to related models. Create one with 'rails generate migration CreateJoinTableUserGroup users groups', which generates a migration for a join table named users_groups."
      },
      {
        question: "What are the various ways to query the database with ActiveRecord?",
        difficulty: "medium",
        category: "ActiveRecord",
        answer: "Query methods include: find(id), find_by(conditions), where(conditions), order(fields), limit(number), offset(number), joins(tables), includes(associations), group(fields), having(conditions), and various aggregations like count, sum, average, etc."
      },
      {
        question: "How do you create a record using ActiveRecord?",
        difficulty: "easy",
        category: "ActiveRecord",
        answer: "You can create a record using: 1) user = User.new(name: 'John'); user.save, 2) User.create(name: 'John'), or 3) User.find_or_create_by(name: 'John'). The create method combines new and save in one step."
      },
      {
        question: "Explain how to define relationships between models in ActiveRecord",
        difficulty: "medium",
        category: "ActiveRecord",
        answer: "Relationships are defined with association methods: has_many, belongs_to, has_one, has_many :through, has_one :through, and has_and_belongs_to_many. For example: 'class User < ApplicationRecord; has_many :posts; end' and 'class Post < ApplicationRecord; belongs_to :user; end'."
      },
      // RUBY FUNDAMENTALS AND PRACTICAL SCENARIOS
      {
        question: "What are the different data types in Ruby?",
        difficulty: "easy",
        category: "Ruby",
        answer: "Ruby has several built-in data types: Numeric (Integer, Float, Complex, Rational), String, Symbol, Boolean (true/false), Array, Hash, Range, RegExp, and nil. Everything in Ruby is an object, including these data types."
      },
      {
        question: "How does inheritance work in Ruby? Does Ruby support multiple inheritance?",
        difficulty: "medium",
        category: "Ruby",
        answer: "Ruby supports single inheritance using the < operator: 'class Child < Parent'. Ruby does not support multiple inheritance directly, but achieves similar functionality through modules (mixins), allowing classes to include behavior from multiple modules."
      },
      {
        question: "Explain the difference between Proc, Lambda, and Block in Ruby",
        difficulty: "hard",
        category: "Ruby",
        answer: "Blocks are anonymous functions passed to methods, not objects. Procs are objects that store blocks and have lenient argument checking. Lambdas are Proc objects with strict argument checking and different return behavior. Lambdas return from their scope; Procs return from the enclosing method."
      },
      {
        question: "What's the difference between puts, print, and p in Ruby?",
        difficulty: "easy",
        category: "Ruby",
        answer: "puts adds a newline at the end and calls to_s on its argument. print doesn't add a newline and also uses to_s. p calls inspect on its argument (showing a more technical representation) and adds a newline, making it useful for debugging."
      },
      {
        question: "How do you define and use class variables vs instance variables in Ruby?",
        difficulty: "medium",
        category: "Ruby",
        answer: "Instance variables start with @ and are available only to a specific instance. Class variables start with @@ and are shared across all instances of a class. Instance: '@name = \"John\"'. Class: '@@count = 0'. Class variables should be used carefully due to inheritance behavior."
      },
      {
        question: "Explain how exception handling works in Ruby",
        difficulty: "medium",
        category: "Ruby",
        answer: "Ruby uses begin/rescue blocks for exception handling: 'begin; risky_operation; rescue ExceptionType => e; handle_exception; else; no_exception_code; ensure; always_executed_code; end'. The ensure block runs whether an exception occurs or not."
      },
      {
        question: "How would you implement a singleton class in Ruby?",
        difficulty: "hard",
        category: "Ruby",
        answer: "A singleton can be implemented using module_function, class methods, or the Singleton module from the standard library. Example: 'require \"singleton\"; class AppConfig; include Singleton; attr_accessor :settings; end; config = AppConfig.instance'"
      },
      {
        question: "How do yield and blocks work in Ruby?",
        difficulty: "medium",
        category: "Ruby",
        answer: "yield calls the block passed to a method. Example: 'def greet; yield(\"Hello\"); end; greet { |msg| puts \"#{msg} World\" }'. Blocks can be made explicit parameters with &block syntax: 'def greet(&block); block.call(\"Hello\"); end'"
      },
      {
        question: "How would you implement a RESTful API in Rails?",
        difficulty: "medium",
        category: "API",
        answer: "1) Define RESTful routes using resources in routes.rb, 2) Create controller with standard CRUD actions, 3) Implement proper HTTP status codes, 4) Use proper content types (typically JSON), 5) Consider versioning with namespace, 6) Use serializers (like Active Model Serializers) for JSON formatting, 7) Implement authentication/authorization."
      },
      {
        question: "How do you test a Rails application?",
        difficulty: "medium",
        category: "Testing",
        answer: "Rails has built-in support for testing with Minitest and can use RSpec. Common tests include: 1) Model tests for validations, associations, and methods, 2) Controller tests for actions and responses, 3) Integration tests for workflows, 4) System tests for browser interactions. Popular tools include FactoryBot, Capybara, and VCR."
      },
      {
        question: "Explain the differences between development, test, and production environments in Rails",
        difficulty: "medium",
        category: "Configuration",
        answer: "Development has detailed error pages, code reloading, and no caching. Test is optimized for testing with its own database. Production has caching enabled, optimized performance, precompiled assets, and minimal error information. Each has its own database configuration and environment-specific settings."
      },
      {
        question: "What is the Asset Pipeline in Rails and what problem does it solve?",
        difficulty: "medium",
        category: "Frontend",
        answer: "The Asset Pipeline is a framework to concatenate, minify and compress JavaScript and CSS assets. It solves performance issues by reducing HTTP requests, enabling preprocessing (Sass, CoffeeScript), and fingerprinting assets for cache busting, all improving page load times."
      },
      {
        question: "How do you secure a Rails application?",
        difficulty: "hard",
        category: "Security",
        answer: "Secure Rails applications by: 1) Using HTTPS, 2) Implementing proper authentication, 3) Using strong parameters, 4) Preventing CSRF with built-in protection, 5) Avoiding SQL injection with parameterized queries, 6) Implementing proper authorization, 7) Setting secure headers, 8) Keeping dependencies updated, 9) Using Content Security Policy."
      },
      {
        question: "What is the difference between save, save!, create, and create! in ActiveRecord?",
        difficulty: "medium",
        category: "ActiveRecord",
        answer: "save and create return true/false for success/failure, while save! and create! raise exceptions on failure. save and save! operate on existing objects, while create and create! instantiate and save in one step. Example: 'user.save' vs 'user.save!' vs 'User.create(params)' vs 'User.create!(params)'"
      },
      {
        question: "How would you debug a Rails application?",
        difficulty: "medium",
        category: "Debugging",
        answer: "Rails debugging techniques include: 1) Using binding.pry or byebug for interactive debugging, 2) Examining logs in development.log, 3) Using Rails console to test code, 4) Adding debug or logger.debug statements, 5) Using the web-console gem, 6) Analyzing server response with browser dev tools, 7) Using performance monitoring tools."
      },
      {
        question: "How do you deploy a Rails application?",
        difficulty: "medium",
        category: "Deployment",
        answer: "Rails deployment typically involves: 1) Setting up a production server (AWS, Heroku, etc.), 2) Configuring web server (Nginx, Apache) with an app server (Puma, Unicorn), 3) Setting environment variables, 4) Precompiling assets, 5) Running migrations, 6) Setting up a CI/CD pipeline, 7) Configuring monitoring and error logging."
      },
      {
        question: "How would you implement real-time features in Rails?",
        difficulty: "hard",
        category: "Advanced",
        answer: "Real-time features can be implemented with: 1) Action Cable for WebSockets, 2) Hotwire (Turbo Streams) for live updates, 3) Server-Sent Events (SSE), 4) Third-party services like Pusher, 5) Polling with JavaScript. Action Cable is integrated with Rails and provides both server-side and client-side components."
      },
      {
        question: "How do you handle file uploads in Rails?",
        difficulty: "medium",
        category: "Features",
        answer: "File uploads can be handled with Active Storage (built into Rails 5.2+) which provides cloud storage integration, file validation, image processing, and direct uploads. Setup involves running 'rails active_storage:install', configuring storage services in config/storage.yml, and adding 'has_one_attached :file' to models."
      },
      {
        question: "How would you implement internationalization (i18n) in a Rails application?",
        difficulty: "medium",
        category: "Features",
        answer: "Rails has built-in i18n support: 1) Configure available locales in application.rb, 2) Create locale files (config/locales/en.yml, etc.), 3) Use I18n.t() or t() helper in views, 4) Set locale based on URL parameters, domain, or user preference, 5) Use locale-specific templates if needed, 6) Consider gems like globalize for model translations."
      },
      {
        question: "Explain what happens when a request hits a Rails application from start to finish",
        difficulty: "hard",
        category: "Architecture",
        answer: "1) Web server receives request, 2) Rack middleware processes it, 3) Router matches URL to controller/action, 4) Controller action runs, potentially interacting with models, 5) ActiveRecord queries database if needed, 6) Controller renders view or redirects, 7) View template is processed, 8) Response passes back through middleware, 9) Web server sends response."
      },
      {
        question: "How do you handle authentication in Rails?",
        difficulty: "medium",
        category: "Security",
        answer: "Authentication options include: 1) Devise gem for full-featured authentication, 2) has_secure_password with bcrypt for simpler needs, 3) OmniAuth for third-party authentication, 4) JWT tokens for API authentication, 5) Authlogic or Clearance gems. Each approach requires different setup but typically involves encrypting passwords and managing sessions."
      },
      {
        question: "How do you handle authorization in Rails?",
        difficulty: "medium",
        category: "Security",
        answer: "Authorization can be implemented with: 1) CanCanCan or Pundit gems, 2) Custom role systems using enums or a roles table, 3) Policy objects. With Pundit, you'd create policy classes defining permissions: 'class PostPolicy < ApplicationPolicy; def update?; user.admin? || record.author == user; end; end'"
      },
      {
        question: "How does session management work in Rails?",
        difficulty: "medium",
        category: "Security",
        answer: "Rails manages sessions using cookies by default. Session data is stored in encrypted cookies with the session ID. Alternative storage options include ActiveRecord, Redis, or Memcached for larger sessions or better performance. Sessions can be configured in config/initializers/session_store.rb."
      },
      {
        question: "What are Rails Engines and when would you use them?",
        difficulty: "hard",
        category: "Architecture",
        answer: "Rails Engines are miniature Rails applications that can be mounted inside a larger app. They're useful for: 1) Sharing code between applications, 2) Modularizing large applications, 3) Creating reusable components like admin panels, CMS, or authentication. Examples include Devise, Spree, and ActiveAdmin."
      },
      {
        question: "How do you optimize database performance in Rails?",
        difficulty: "hard",
        category: "Performance",
        answer: "Database optimization techniques include: 1) Adding proper indexes, 2) Using includes, preload, or eager_load to prevent N+1 queries, 3) Using counter caches for counts, 4) Batching operations with find_each or in_batches, 5) Using database-specific features via execute, 6) Query optimization, 7) Database connection pooling, 8) Using query objects for complex queries."
      }
    ];
    
    // Insert questions in batches
    for (const question of questionsData) {
      await this.createQuestion(question);
    }
  }
} 