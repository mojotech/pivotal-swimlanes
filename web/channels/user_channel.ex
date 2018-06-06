defmodule PivotalSwimlanes.UserChannel do
  use PivotalSwimlanes.Web, :channel

  def join("users:" <> user_id, _params, socket) do
    {:ok, socket}
  end
end
