import { expect, test } from "vitest";

import type { ErrorResponse } from "@/pkg/errors";
import { RouteHarness } from "@/pkg/testutil/route-harness";
import { newId } from "@unkey/id";
import { registerLegacyApisDeleteApi } from "./legacy_apis_deleteApi";

test("api not found", async () => {
  using h = new RouteHarness();
  await h.seed();
  h.useRoutes(registerLegacyApisDeleteApi);

  const apiId = newId("api");

  const { key: rootKey } = await h.createRootKey(["*"]);

  const res = await h.delete<ErrorResponse>({
    url: `/v1/apis/${apiId}`,
    headers: {
      Authorization: `Bearer ${rootKey}`,
    },
  });

  expect(res.status).toEqual(404);
  expect(res.body).toMatchObject({
    error: {
      code: "NOT_FOUND",
      docs: "https://unkey.dev/docs/api-reference/errors/code/NOT_FOUND",
      message: `api ${apiId} not found`,
    },
  });
});
