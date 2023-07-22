const Sequelize = require('sequelize');
const path = require('path');
const Logger = require('../../../loaders/logger');
const { db } = require('../../../loaders/sequelizerConfig');
const config = require('../../../config');

// Create and Save a new User
exports.create = async (req, res) => {
    try {
      // Create a article
      const articleData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber ? req.body.phoneNumber : '',
        hasBlockedNotifications: req.body.hasBlockedNotifications,
        createdBy: req.loggedInUserId,
        approvalStatusId: approvalStatus,
      };
  
      // Save User in the database
      const user = await User.create(articleData);
  
      return res.status(201).send(user);
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .send("Error occurred while creating User: '" + err.message + "'");
    }
  };
  
  // Retrieve all Users from the database.
  exports.search = async (req, res) => {
    try {
      const {
        basicSearch,
        limit,
        page,
        status,
        viewMyApproverListing,
        sortOrder,
      } = req.body;
  
      const userDetails = await getUserDetail(req.loggedInUserId);
      let userPortfolios = userDetails ? userDetails.userPortfolios : null;
      const userPortfolioIds = userPortfolios
        ? userPortfolios.map((userPortfolios) => userPortfolios.id)
        : null;
      let condition8 = userPortfolios
        ? { '$userPortfolios.id$': { [Op.in]: userPortfolioIds } }
        : { '$userPortfolios.id$': { [Op.in]: [] } };
  
      const condition1 = basicSearch
        ? { firstName: { [Op.iLike]: `%${basicSearch}%` } }
        : null;
      const condition2 = basicSearch
        ? { lastName: { [Op.iLike]: `%${basicSearch}%` } }
        : null;
      const condition3 = basicSearch
        ? { email: { [Op.iLike]: `%${basicSearch}%` } }
        : null;
      const condition4 = basicSearch
        ? { phoneNumber: { [Op.iLike]: `%${basicSearch}%` } }
        : null;
      const statusTextSearch = basicSearch
        ? { '$approvalStatus.name$': { [Op.iLike]: `${basicSearch}%` } }
        : null;
  
      const channel = basicSearch
        ? await Channel.findAll({
            where: Sequelize.where(
              Sequelize.fn(
                'concat',
                Sequelize.col('primaryChannel.name'),
                '.',
                Sequelize.col('businessUnit.name'),
                '.',
                Sequelize.col('channel.name')
              ),
              {
                [Op.iLike]: `%${basicSearch}%`,
              }
            ),
            include: [
              {
                model: PrimaryChannel,
                as: 'primaryChannel',
              },
              {
                model: BusinessUnit,
                as: 'businessUnit',
              },
            ],
            raw: true,
          })
        : null;
  
      const channelIds = channel ? channel.map((channel) => channel.id) : null;
      const condition5 = channelIds
        ? { channelId: { [Op.in]: channelIds } }
        : null;
  
      const user = basicSearch
        ? await UserChannel.findAll({ where: condition5, raw: true })
        : null;
      const userIds = user ? user.map((user) => user.userId) : null;
      const condition6 = userIds ? { id: { [Op.in]: userIds } } : null;
  
      const roles = basicSearch
        ? await Role.findAll({
            where: { name: { [Op.iLike]: `${basicSearch}%` } },
            raw: true,
          })
        : null;
  
      const roleIds = roles ? roles.map((role) => role.id) : null;
      const condition9 = roleIds ? { roleId: { [Op.in]: roleIds } } : null;
  
      const userRoles = basicSearch
        ? await UserRole.findAll({ where: condition9, raw: true })
        : null;
      const userRoleIds = userRoles ? userRoles.map((user) => user.userId) : null;
      const condition10 = userRoleIds ? { id: { [Op.in]: userRoleIds } } : null;
      const condition12 = basicSearch
        ? Sequelize.where(
            Sequelize.fn(
              'to_char',
              Sequelize.col('user.createdAt'),
              'dd/mm/yyyy'
            ),
            { [Op.iLike]: `%${basicSearch}%` }
          )
        : null;
  
      let condition7 = null;
      if (status === 'Pending') {
        condition7 = { approvalStatusId: { [Op.eq]: 1 } };
      }
  
      if (viewMyApproverListing === true) {
        condition7 = { approvalStatusId: { [Op.ne]: 2 } };
      }
  
      const condition11 = { id: { [Op.ne]: req.loggedInUserId } };
  
      const pagelimit = limit ? limit : null;
      const pageOffset = page ? pagelimit * (page - 1) : null;
      const pageSortOrder = sortOrder ? sortOrder : ['id', 'ASC'];
  
      if (condition7) {
        whereObj = {
          [Op.and]: [
            {
              [basicSearch ? Op.or : Op.and]: [
                condition1,
                condition2,
                condition3,
                condition4,
                condition6,
                condition10,
                statusTextSearch,
                condition12,
              ],
            },
            condition7,
            condition8,
            condition11,
          ],
        };
      } else {
        whereObj = {
          [Op.and]: [
            {
              [basicSearch ? Op.or : Op.and]: [
                condition1,
                condition2,
                condition3,
                condition4,
                condition6,
                condition10,
                statusTextSearch,
                condition12,
              ],
            },
            condition11,
          ],
        };
      }
  
      const users = await User.findAll({
        where: whereObj,
        include: [
          {
            model: Channel,
            as: 'userPortfolios',
            attributes: [
              'id',
              [
                Sequelize.fn(
                  'concat',
                  Sequelize.col('userPortfolios.primaryChannel.name'),
                  '.',
                  Sequelize.col('userPortfolios.businessUnit.name'),
                  '.',
                  Sequelize.col('userPortfolios.name')
                ),
                'portfolio',
              ],
            ],
            include: [
              {
                model: BusinessUnit,
                as: 'businessUnit',
                attributes: [],
              },
              {
                model: PrimaryChannel,
                as: 'primaryChannel',
                attributes: [],
              },
            ],
            through: {
              attributes: [],
            },
          },
          {
            model: Role,
            as: 'userRoles',
            attributes: ['id', 'name'],
            through: {
              attributes: [],
            },
          },
          {
            model: ApprovalStatus,
            as: 'approvalStatus',
          },
        ],
        limit: pagelimit,
        offset: pageOffset,
        order: [pageSortOrder],
      });
  
      return res.send({ count: users.length, rows: users });
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        message: err.message || ' Some error occurred while fetching users.',
      });
    }
  };
  
  // Find a single User with an id
  exports.findOne = async (req, res) => {
    //id should be integer
    const { id } = req.params;
  
    if (!id) {
      return res.status(404).send({
        message: `User not found`,
      });
    }
    try {
      let user = await User.findByPk(id, {
        order: [
          // ...we use the same syntax from the include
          // in the beginning of the order array
          [{ model: UserComments, as: 'comments' }, 'createdAt', 'DESC'],
        ],
      });
  
      let response = user.get();
      return res.status(200).send(response);
    } catch (err) {
      console.log('Error ', err);
      res.status(500).send({
        message: `Error retrieving User with id=${id}`,
      });
    }
  };
  