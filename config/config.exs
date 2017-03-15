# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :pivotal_swimlanes,
  ecto_repos: [PivotalSwimlanes.Repo]

# Configures the endpoint
config :pivotal_swimlanes, PivotalSwimlanes.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "SD7NYPOu1FlWJ1wQGsycbsaEUkXmHR84afk03NZqmGHjdy12eu+DwTFv9rrq7n9+",
  render_errors: [view: PivotalSwimlanes.ErrorView, accepts: ~w(html json)],
  pubsub: [name: PivotalSwimlanes.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

defmodule SecretKey do
  def fetch do
    if Mix.env == :prod do
      JOSE.JWK.from_pem(System.get_env("AUTH_KEY"))
    else
      JOSE.JWK.from_pem_file("ec512-auth-key.pem")
    end
  end
end

config :guardian, Guardian,
  allowed_algos: ["ES512"],
  verify_issuer: true,
  issuer: "PivotalSwimlanes",
  ttl: { 1, :years },
  secret_key: {SecretKey, :fetch},
  serializer: PivotalSwimlanes.GuardianSerializer

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
