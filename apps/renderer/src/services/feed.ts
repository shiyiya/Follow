
import { browserDB } from "~/database"
import type { FeedOrListModel } from "~/models/types"

import { BaseService } from "./base"
import { CleanerService } from "./cleaner"

type TargetModelWithId = FeedOrListModel & { id: string }
class ServiceStatic extends BaseService<TargetModelWithId> {
  constructor() {
    super(browserDB.feeds)
  }

  override async upsertMany(data: FeedOrListModel[]) {
    const filterData = data.filter((d) => d.id)

    CleanerService.reset(filterData.map((d) => ({ type: "feed", id: d.id! })))

    return this.table.bulkPut(filterData as TargetModelWithId[])
  }

  override async upsert(data: FeedOrListModel): Promise<string | null> {
    if (!data.id) return null
    CleanerService.reset([{ type: "feed", id: data.id }])
    return this.table.put(data as TargetModelWithId)
  }

  async bulkDelete(ids: string[]) {
    return this.table.bulkDelete(ids)
  }
}

export const FeedService = new ServiceStatic()
