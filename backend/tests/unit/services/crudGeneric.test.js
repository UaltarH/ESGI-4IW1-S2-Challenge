const { create, findAll, findOne, findByPk, update, destroy } = require('../../../src/services/crudGeneric');

// Mock d'un modèle Sequelize
const mockModel = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  findByPk: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
};

describe('CRUD Operations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('devrait créer un enregistrement avec succès', async () => {
      const mockData = { name: 'Test' };
      mockModel.create.mockResolvedValue(mockData);

      const result = await create(mockModel, mockData);
      expect(result).toEqual({ data: mockData, error: null });
      expect(mockModel.create).toHaveBeenCalledWith(mockData);
    });

    it('devrait gérer les erreurs lors de la création', async () => {
      const mockError = new Error('Erreur de création');
      mockModel.create.mockRejectedValue(mockError);

      const result = await create(mockModel, {});
      expect(result).toEqual({ data: null, error: mockError });
    });
  });

  describe('findAll', () => {
    it('devrait trouver tous les enregistrements correspondants', async () => {
      const mockRecords = [{ id: 1 }, { id: 2 }];
      mockModel.findAll.mockResolvedValue(mockRecords);

      const result = await findAll(mockModel, { status: 'active' });
      expect(result).toEqual({ data: mockRecords, error: null });
      expect(mockModel.findAll).toHaveBeenCalledWith({ where: { status: 'active' } });
    });

    it('devrait gérer les erreurs lors de la recherche', async () => {
      const mockError = new Error('Erreur de recherche');
      mockModel.findAll.mockRejectedValue(mockError);

      const result = await findAll(mockModel, {});
      expect(result).toEqual({ data: null, error: mockError });
    });
  });

  describe('findOne', () => {
    it('devrait trouver un enregistrement', async () => {
      const mockRecord = { id: 1, name: 'Test' };
      mockModel.findOne.mockResolvedValue(mockRecord);

      const result = await findOne(mockModel, { id: 1 });
      expect(result).toEqual({ data: mockRecord, error: null });
      expect(mockModel.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('devrait retourner une erreur si aucun enregistrement n\'est trouvé', async () => {
      mockModel.findOne.mockResolvedValue(null);

      const result = await findOne(mockModel, { id: 1 });
      expect(result).toEqual({ data: null, error: new Error('Record not found') });
    });
  });

  describe('findByPk', () => {
    it('devrait trouver un enregistrement par clé primaire', async () => {
      const mockRecord = { id: 1, name: 'Test' };
      mockModel.findByPk.mockResolvedValue(mockRecord);

      const result = await findByPk(mockModel, 1);
      expect(result).toEqual({ data: mockRecord, error: null });
      expect(mockModel.findByPk).toHaveBeenCalledWith(1);
    });

    it('devrait retourner une erreur si aucun enregistrement n\'est trouvé', async () => {
      mockModel.findByPk.mockResolvedValue(null);

      const result = await findByPk(mockModel, 1);
      expect(result).toEqual({ data: null, error: new Error('Record not found') });
    });
  });

  describe('update', () => {
    it('devrait mettre à jour un enregistrement', async () => {
      const mockUpdatedRecord = { id: 1, name: 'Updated' };
      mockModel.update.mockResolvedValue([1]);
      mockModel.findByPk.mockResolvedValue(mockUpdatedRecord);

      const result = await update(mockModel, 1, { name: 'Updated' });
      expect(result).toEqual({ data: mockUpdatedRecord, error: null });
      expect(mockModel.update).toHaveBeenCalledWith({ name: 'Updated' }, expect.any(Object));
    });

    it('devrait retourner une erreur si aucun enregistrement n\'est trouvé pour la mise à jour', async () => {
      mockModel.update.mockResolvedValue([0]);

      const result = await update(mockModel, 1, { name: 'Updated' });
      expect(result).toEqual({ data: null, error: new Error('Record not found') });
    });
  });

  describe('destroy', () => {
    it('devrait supprimer un enregistrement', async () => {
      mockModel.destroy.mockResolvedValue(1);

      const result = await destroy(mockModel, 1);
      expect(result).toEqual({ data: true, error: null });
      expect(mockModel.destroy).toHaveBeenCalledWith(expect.any(Object));
    });

    it('devrait retourner une erreur si aucun enregistrement n\'est trouvé pour la suppression', async () => {
      mockModel.destroy.mockResolvedValue(0);

      const result = await destroy(mockModel, 1);
      expect(result).toEqual({ data: null, error: new Error('Record not found') });
    });
  });
});