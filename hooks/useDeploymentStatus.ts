"use client";

import { useEffect, useState } from "react";
import type { ServiceStatus } from "@/app/api/status/route";

export type DeploymentStatusState = "loading" | "ready" | "error";

export function useDeploymentStatus() {
  const [state, setState] = useState<DeploymentStatusState>("loading");
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [checkedAt, setCheckedAt] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/status")
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json();
      })
      .then((data: { services: ServiceStatus[]; checkedAt: string }) => {
        if (cancelled) return;
        setServices(data.services);
        setCheckedAt(data.checkedAt);
        setState("ready");
      })
      .catch(() => {
        // La comprobación es información extra, no contenido: si falla,
        // la página no debe enseñar un error.
        if (!cancelled) setState("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { state, services, checkedAt };
}
