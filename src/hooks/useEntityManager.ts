
import { useApiData } from './useApiData';

export interface Entity {
  id: number;
  name: string;
}

export function useEntityManager(entityType: string) {
  const {
    data: entities,
    loading,
    fetchData,
    createItem,
    updateItem,
    deleteItem,
  } = useApiData<Entity>({
    key: entityType,
    fallback: [],
  });

  const addEntity = async (name: string) => {
    if (entities.some(e => e.name === name)) {
      throw new Error('Entidade já existe');
    }
    return await createItem({ name });
  };

  const editEntity = async (id: number, newName: string) => {
    return await updateItem(id.toString(), { name: newName });
  };

  const removeEntity = async (id: number) => {
    await deleteItem(id.toString());
  };

  return {
    entities,
    loading,
    fetchData,
    addEntity,
    editEntity,
    removeEntity,
  };
}
