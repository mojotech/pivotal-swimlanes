defmodule PivotalSwimlanes.User do
  use PivotalSwimlanes.Web, :model

  schema "users" do
    field :first_name, :string
    field :last_name, :string
    field :email, :string
    field :password, :string, virtual: true
    field :encrypted_password, :string
    field :github_token, :string
    field :pivotal_token, :string
    field :pivotal_project_id, :integer

    timestamps()
  end

  @derive {Poison.Encoder, only: [
    :id, :first_name, :last_name, :email, :github_token, :pivotal_token,
    :pivotal_project_id]}

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:first_name, :last_name, :email, :password, :encrypted_password,
        :github_token, :pivotal_token, :pivotal_project_id])
    |> validate_required([:first_name, :last_name, :email, :password])
    |> validate_format(:email, ~r/@/)
    |> validate_length(:password, min: 8)
    |> validate_confirmation(:password_confirmation, message: "Password must contain at least 8 characters")
    |> unique_constraint(:email, message: "This email is already taken")
    |> generate_encrypted_password
  end

  def update_changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:first_name, :last_name, :email, :github_token, :pivotal_token, :pivotal_project_id])
  end

  defp generate_encrypted_password(current_changeset) do
    case current_changeset do
      %Ecto.Changeset{valid?: true, changes: %{password: password}} ->
        put_change(current_changeset, :encrypted_password, Comeonin.Bcrypt.hashpwsalt(password))
      _ ->
        current_changeset
    end
  end
end
