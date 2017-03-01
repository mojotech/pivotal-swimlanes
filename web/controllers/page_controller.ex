defmodule PivotalSwimlanes.PageController do
  use PivotalSwimlanes.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
