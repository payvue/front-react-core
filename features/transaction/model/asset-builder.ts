import {
  AssetTransactionDetails,
  AssetTransactionSchema,
  TransactionModel,
  TransactionModelBuilder,
} from '../types'

export class AssetTransactionModelBuilder
  implements TransactionModelBuilder<AssetTransactionSchema>
{
  buildList(source: AssetTransactionSchema[]): TransactionModel[] {
    if (!source) return []

    return source.map((item) => this.buildDetail(item))
  }

  buildDetail(item: AssetTransactionSchema): TransactionModel {
    const details: AssetTransactionDetails = item.details ?? {
      assetName: item.description,
    }

    return {
      id: item.id,
      title: details.assetName ?? item.description,
      subtitle: details.groupName ?? details.relatedUser,
      amount: item.amount,
      status: item.status,
      occurredAt: item.occurredAt,
      metadata: {
        그룹: details.groupName ?? '-',
        관련유저: details.relatedUser ?? '-',
        자산카테고리: details.categoryLabel ?? item.category ?? '-',
      },
      category: details.categoryLabel ?? item.category,
      kind: item.kind,
    }
  }
}

export const assetTransactionBuilder = new AssetTransactionModelBuilder()
