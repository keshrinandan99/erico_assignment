import prisma from "../db.js";

export const createLeads = async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            email,
            phone,
            company,
            city,
            state,
            source,
            status,
            score,
            lead_value
        } = req.body;

        if (!email || !phone || !lead_value) {
            return res.status(401).json("email, phone and lead_value are required fields");
        }

        const createdLeads = await prisma.leads.create({
            data: {
                first_name,
                last_name,
                email,
                phone,
                company,
                city,
                state,
                source,
                status,
                score,
                lead_value
            }
        });

        return res.status(201).json({ message: "Lead creation successful!", lead: createdLeads });

    } catch (error) {
        console.log("Error while creating Lead", error);
        return res.status(401).json({ message: "Error creating lead", error });
    }
}
export const fetchAllLeads = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      source,
      city,
      state,
      is_qualified,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = req.query;

    const where = {};
    if (status) where.status = status;
    if (source) where.source = source;
    if (city) where.city = { contains: city, mode: 'insensitive' };
    if (state) where.state = { contains: state, mode: 'insensitive' };
    if (is_qualified !== undefined) where.is_qualified = is_qualified === 'true';

    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

   
    const orderBy = {};
    orderBy[sortBy] = sortOrder.toLowerCase();

    const [data, total] = await Promise.all([
      prisma.leads.findMany({
        where,
        skip,
        take,
        orderBy
      }),
      prisma.leads.count({ where })
    ]);

    const totalPages = Math.ceil(total / take);

    return res.status(200).json({
      data,
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages
    });

  } catch (error) {
    console.log("fetchAllLeads Error", error);
    return res.status(401).json({ message: "Error fetching leads", error });
  }
}
export const fetchLeadsById=async(req,res)=>{
    try {
        const {id}=req.params
        if(!id){
            return res.status(401).json({message:"Lead id is required"})
        }
        const lead=await prisma.leads.findUnique({
            where:{
                id:id
            }
        })
        if(!lead){
            return res.status(401).json({message:"Lead Not found"})
        }
        return res.status(201).json({message:`Lead with ${id} fetched successfully`,lead})
    } catch (error) {
        console.log("Error while fetching lead by id", error);
        res.status(401).json({message:"Error while fetching lead by id ", error})
        
        
    }


}
export const updateLeads=async(req,res)=>{
    try {
        const {id}=req.params
        const {
            first_name,
            last_name,
            email,
            phone,
            company,
            city,
            state,
            source,
            status,
            score,
            lead_value
        } = req.body;
        if(!id){
            return res.status(401).json({message:"Lead Id not found"})
        }
        const existingLead=await prisma.leads.findUnique({
            where:{
                id:id
            }
        })
        if(!existingLead){
            return res.status(401).json({message:"Lead doesn't exist you are trying to update"})
        }
        const updateLead = await prisma.leads.update({
            where:{
                id:id
            },
            data: {
                first_name,
                last_name,
                email,
                phone,
                company,
                city,
                state,
                source,
                status,
                score,
                lead_value
            }
        });
        return res.status(200).json({message:"Lead updated successful", lead:updateLead})


    } catch (error) {
        console.log("Error updating lead", error);
        return res.status(401).json({message:"Error updating lead"})
        
        
    }

}
export const deleteLeads=async(req,res)=>{
    try {
        const {id}=req.params
        if(!id){
            return res.status(401).json("Lead Id is required ")
        }
        const existingLead=await prisma.leads.findUnique({
            where:{
                id:id
            }
        })
        if(!existingLead){
            return res.status(401).json({message:"Lead does not exist"})
        }

        await prisma.leads.delete({
            where:{
                id:id
            }
        })
        return res.status(200).json({message:"Lead Deleted successfully"},existingLead)
    } catch (error) {
        console.log("Error deleting Lead", error);
        return res.status(401).json({message:"Error deleting Lead",error })
        
        
    }

}