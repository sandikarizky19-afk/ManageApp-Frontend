import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';

interface Workspace {
  id: number;
  name: string;
}

interface WorkspaceResponse {
  data: Workspace[];
}

function WorkspaceList() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<WorkspaceResponse>('/workspaces')
      .then((res) => setWorkspaces(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {workspaces.map((ws) => (
        <li key={ws.id}>{ws.name}</li>
      ))}
      <p>hello world!</p>
    </ul>
  );
}

export default WorkspaceList;
