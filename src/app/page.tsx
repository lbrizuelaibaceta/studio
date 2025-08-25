
import NewQueryPage from "./new-query/page";

// This is the new landing page for "vendedor" users.
// It directly shows the new query page, simplifying the flow for them.
// The admin will now use the /dashboard route to see both options.
export default function VendedorHomePage() {
  return <NewQueryPage />;
}
