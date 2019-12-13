import { useState } from "react";
import useFetch from "use-http";

type BuildOptions = {
  executor: string; // default 5.30.1
  title: string;
  files: { name: string; content: string }[];
  dependencies: { name: string; version: string | null }[];
};

type State = {
  isBuilding: boolean;
  isFetching: boolean;
};

export default function useAltarBuild() {
  const [request, response] = useFetch("https://altar.mochizuki.dev/internal");

  const startExecution = async (params: BuildOptions) => {
    const execution = await request.post(`/execution`, params);
    return response.ok ? execution : {};
  };

  const fetchExecution = async (buildId: string) => {
    const execution = await request.get(`/execution/${buildId}`);
    return response.ok ? execution : {};
  };

  const fetchStatus = async (buildId: string) => {
    const status = await request.get(`/execution/${buildId}/status`);
    return response.ok ? status : {};
  };

  const fetchTask = async (id: string) => {
    const task = await request.get(`/task/${id}`);
    return response.ok ? task : {};
  };

  return { startExecution, fetchExecution, fetchStatus, fetchTask };
}
