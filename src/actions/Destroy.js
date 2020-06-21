import Action from './Action';
import Context from '../common/context';

export default class Destroy extends Action {
  /**
   * Is Called after new model deletion from the store
   *
   * @param {object} record
   * @param {string} entityName
   */
  static async call({ state, dispatch }, payload) {
    return dispatch('delete', payload).then(async (result) => {
      if (result) {
        const context = Context.getInstance();
        const model = context.getModelFromState(state);
        const records = Array.isArray(result) ? result : [result];

        await Promise.all(records.map((record) => {
          const key = this.getRecordKey(record);
          return model.$localStore.removeItem(key);
        }));
      }

      return result;
    });
  }
}
