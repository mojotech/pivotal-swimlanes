defmodule PivotalSwimlanes.CurrentUserView do
  use PivotalSwimlanes.Web, :view

  def render("show.json", %{user: user}) do
    user_json(user)
  end

  def render("forbidden.json", %{error: error}) do
    %{error: error}
  end

  defp user_json(user) do
    %{
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      pivotalToken: user.pivotal_token || nil,
      githubToken: user.github_token || nil,
      pivotalProjectId: user.pivotal_project_id || nil
    }
  end
end
