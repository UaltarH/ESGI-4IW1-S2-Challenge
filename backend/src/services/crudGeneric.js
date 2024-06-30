const create = async (Model, data) => {
    try {
        const record = await Model.create(data);
        return { data: record, error: null };
    } catch (error) {
        return { data: null, error };
    }
};

const findAll = async (Model, query) => {
    try {
        const records = await Model.findAll({ where: query });
        return { data: records, error: null };
    } catch (error) {
        return { data: null, error };
    }
};

const findByPk = async (Model, id) => {
    try {
        const record = await Model.findByPk(id);
        if (!record) {
            return { data: null, error: new Error('Record not found') };
        }
        return { data: record, error: null };
    } catch (error) {
        return { data: null, error };
    }
};

const update = async (Model, id, data) => {
    try {
        const [updated] = await Model.update(data, {
            where: { id },
            returning: true,
        });
        if (updated === 0) {
            return { data: null, error: new Error('Record not found') };
        }
        const updatedRecord = await Model.findByPk(id);
        return { data: updatedRecord, error: null };
    } catch (error) {
        return { data: null, error };
    }
};

const destroy = async (Model, id) => {
    try {
        const deleted = await Model.destroy({
            where: { id },
        });
        if (deleted === 0) {
            return { data: null, error: new Error('Record not found') };
        }
        return { data: true, error: null };
    } catch (error) {
        return { data: null, error };
    }
};

module.exports = {
    create,
    findAll,
    findByPk,
    update,
    destroy,
};
