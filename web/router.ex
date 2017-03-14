defmodule PivotalSwimlanes.Router do
  use PivotalSwimlanes.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
    plug Guardian.Plug.VerifyHeader
    plug Guardian.Plug.LoadResource
  end

  scope "/api", PivotalSwimlanes do
    pipe_through :api

    post "/registrations", RegistrationController, :create
    post "/sessions", SessionController, :create
    delete "/sessions", SessionController, :delete
  end

  scope "/", PivotalSwimlanes do
    pipe_through :browser # Use the default browser stack

    get "/*path", PageController, :index
  end

  # Other scopes may use custom stacks.

end
