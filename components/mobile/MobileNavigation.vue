<script setup lang="ts">
const { notifications, onMarkAsRead } = useNotifications()
</script>

<template>
  <section class="bg-gray-400 py-2 text-white shadow-card">
    <div
      class="mx-auto flex w-full max-w-content-container items-center justify-between px-5"
    >
      <BaseTooltip message="This dev traded 3 neurons for this name.">
        <LogoIcon />
      </BaseTooltip>

      <div class="flex items-center gap-x-4">
        <NotificationPopover
          :notifications="notifications"
          @mark-as-read="onMarkAsRead"
        >
          <NotificationButton :notifications="notifications" />
        </NotificationPopover>

        <BaseTooltip message="Wanna have a drink with me instead?">
          <button class="flex h-7 w-7 items-center justify-center">
            <MenuIcon />
          </button>
        </BaseTooltip>
      </div>
    </div>
  </section>
</template>
