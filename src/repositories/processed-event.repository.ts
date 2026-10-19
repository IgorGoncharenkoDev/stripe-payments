export type ProcessedEventRepository = {
  /*
   * Potential issues:
   *
   * if we create the following fns and use them:
   * create(stripeEventId: string): Promise<void>
   * exists(stripeEventId: string): Promise<boolean>
   *
   * exists() check + create() -> contains a race.
   * Two requests can do exists() → false and then both create
   *
   * Instead:
   * claim() - is one database operation.
   * The database decides atomically whether the event already exists.
   *
   * And because our model has:
   * stripeEventId: { type: String, required: true, unique: true }
   * the database has a unique constraint backing this idempotency mechanism.
   *
   * So instead of relying on "check → then insert" we rely on database constraints for correctness.
   * This is a much stronger design.
   *
   * */

  // true - the request successfully claimed the event, continue processing
  // false - the event was already claimed, do nothing
  claim(stripeEventId: string): Promise<boolean>
}
