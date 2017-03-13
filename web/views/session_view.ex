defmodule PivotalSwimlanes.SessionView do
  use PivotalSwimlanes.Web, :view

  def render("show.json", %{jwt: jwt, user: user}) do
    %{
      jwt: jwt,
      user: user_json(user)
    }
  end

  def render("error.json", _) do
    %{error: "Invalid email or password"}
  end

  def render("delete.json", _) do
    %{ok: true}
  end

  def render("forbidden.json", %{error: error}) do
    %{error: error}
  end

  defp user_json(user) do
    %{
      id: user.id,
      first_name: user.first_name
    }
  end
end
