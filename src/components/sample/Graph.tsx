import "./Graph.css";
import { useGraphWithCredential } from "@microsoft/teamsfx-react";
import { Providers, ProviderState } from "@microsoft/mgt-element";
import { TeamsFxProvider } from "@microsoft/mgt-teamsfx-provider";
import { Button } from "@fluentui/react-components";
import { PersonCardGraphToolkit } from "./PersonCardGraphToolkit";
import { useContext } from "react";
import { TeamsFxContext } from "../Context";

export function Graph() {
  const { teamsUserCredential } = useContext(TeamsFxContext);
  const { loading, error, data, reload } = useGraphWithCredential(
    async (graph, teamsUserCredential, scope) => {
      // Call graph api directly to get user profile information
      const profile = await graph.api("/me").get();

      // Initialize Graph Toolkit TeamsFx provider
      const provider = new TeamsFxProvider(teamsUserCredential, scope);
      Providers.globalProvider = provider;
      Providers.globalProvider.setState(ProviderState.SignedIn);

      let photoUrl = "";
      try {
        const photo = await graph.api("/me/photo/$value").get();
        photoUrl = URL.createObjectURL(photo);
      } catch {
        // Could not fetch photo from user's profile, return empty string as placeholder.
      }
      return { profile, photoUrl };
    },
    { scope: ["User.Read"], credential: teamsUserCredential }
  );

  return (
    <div>
      <p>Click below to authorize button to grant permission to using Microsoft Graph.</p>
      <Button appearance="primary" disabled={loading} onClick={reload}>
        Authorize
      </Button>
      <PersonCardGraphToolkit loading={loading} data={data} error={error} />
    </div>
  );
}
