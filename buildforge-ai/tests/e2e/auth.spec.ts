/// <reference types="@playwright/test" />
import { test, expect } from "@playwright/test";

test("home page loads with hero", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /your idea/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /sign in/i })).toBeVisible();
});

test("login page renders", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
  await expect(page.getByLabel(/email/i)).toBeVisible();
});

test("signup page renders", async ({ page }) => {
  await page.goto("/signup");
  await expect(page.getByRole("heading", { name: /create your account/i })).toBeVisible();
});

test("dashboard requires auth", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login/);
});
