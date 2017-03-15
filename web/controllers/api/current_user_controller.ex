defmodule PivotalSwimlanes.CurrentUserController do
  use PivotalSwimlanes.Web, :controller
  alias PivotalSwimlanes.{Repo, User}

  plug Guardian.Plug.EnsureAuthenticated, handler: PivotalSwimlanes.SessionController

  def show(conn, _) do
    user = Guardian.Plug.current_resource(conn)

    conn
    |> put_status(:ok)
    |> render("show.json", user: user)

  end

  def update(conn, %{"id" => id, "user" => user_params}) do
    current_user = Guardian.Plug.current_resource(conn)

    changeset = current_user
    |> User.update_changeset(user_params)

    IO.inspect(changeset);

    case Repo.update(changeset) do
      {:ok, user} ->
        conn
        |> render("show.json", user: user)

      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(PivotalSwimlanes.ChangesetView, "error.json", changeset: changeset)
    end

  end
end
