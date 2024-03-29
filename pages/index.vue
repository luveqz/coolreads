<script setup lang="ts">
import type { Activity, ActivityType } from '@/lib/models/content'
import { featuredBook } from '@/database/fixtures/widgets'

definePageMeta({
  title: 'Haylee Caulfield',
})

const ITEMS_PER_PAGE = 5
const hasNextPage = ref(true)
const feedType = ref<ActivityType | undefined>(undefined)
const skip = ref(0)
const feedLoader = ref()

const activities = ref<Activity[]>([])
const activityStats = ref()
const feedLoading = ref(true)
const statsLoading = ref(true)

const fetchStats = async () => {
  statsLoading.value = true
  const { data } = await useAsyncData('stats', () =>
    useGraphQL().getActivityStatsByUser({
      userId: 1,
    }),
  )
  activityStats.value = data.value?.activityStats
  statsLoading.value = false
}

const setFeedType = (activityType?: ActivityType) => {
  feedType.value = activityType
  skip.value = 0
  hasNextPage.value = true
  activities.value = []
}

const fetchFeed = async (activityType?: ActivityType) => {
  if (feedType.value !== activityType) {
    setFeedType(activityType)
    return
  }

  if (!hasNextPage.value) return

  feedLoading.value = true

  const { data } = await useAsyncData('feed', () =>
    useGraphQL().getActivitiesByUser({
      userId: 1,
      take: ITEMS_PER_PAGE,
      skip: skip.value,
      activityType,
    }),
  )

  if (data.value?.activities.nodes)
    activities.value = [...activities.value, ...data.value.activities.nodes]

  hasNextPage.value = !!data.value?.activities.pageInfo.hasNextPage
  skip.value += ITEMS_PER_PAGE

  feedLoading.value = false
}

onMounted(() =>
  useIntersectionObserver(
    feedLoader,
    ([{ isIntersecting }]) => {
      if (isIntersecting) {
        fetchFeed(feedType.value)
      }
    },
    {
      rootMargin: '20px',
    },
  ),
)

await Promise.all([fetchStats(), fetchFeed()])
</script>

<template>
  <div
    class="mx-auto mt-9 max-w-content-container grid-cols-main gap-x-10 px-5 md:grid"
  >
    <main class="pb-8">
      <ProfileHeader />
      <ActivityTabs
        v-if="!statsLoading && activityStats"
        :review-counter="activityStats.reviews"
        :quote-counter="activityStats.quotes"
        :list-counter="activityStats.bookLists"
        @change="fetchFeed"
      />

      <section class="flex flex-col gap-y-4">
        <BaseFeed :activities="activities">
          <ClientOnly>
            <div
              v-if="hasNextPage"
              ref="feedLoader"
              class="mx-auto flex justify-center"
            >
              <LoadingIcon v-if="feedLoading" />
            </div>
          </ClientOnly>
        </BaseFeed>
      </section>
    </main>

    <ScrollableStickySidebar class="hidden md:block">
      <aside class="flex flex-col gap-y-10">
        <LeaderBoardWidget />
        <FeaturedBookWidget
          title="Recommended by Haylee"
          subtitle="This week"
          :book="featuredBook"
        />
      </aside>

      <TheFooter />
    </ScrollableStickySidebar>
  </div>
</template>
