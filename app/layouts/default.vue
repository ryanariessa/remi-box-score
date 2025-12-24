<template>
  <div
    class="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300"
  >
    <AppHeader />

    <main class="flex-1">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>