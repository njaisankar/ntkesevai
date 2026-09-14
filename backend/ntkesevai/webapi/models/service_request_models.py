from django.db import models

class ServiceRequestDetails(models.Model):
    id = models.BigAutoField(primary_key=True)
    service_details = models.ForeignKey('ServiceDetails', on_delete=models.CASCADE, null=True, blank=True, db_column='service_details_id', related_name='requests')
    # Regional Location Mappings matching your precise DB column names
    district = models.ForeignKey('DistrictDetails', on_delete=models.CASCADE, db_column='district_id')
    block = models.ForeignKey('BlockDetails', on_delete=models.CASCADE, null=True, blank=True, db_column='block_id')
    town_panchayat = models.ForeignKey('TownPanchayatDetails', on_delete=models.CASCADE, null=True, blank=True, db_column='town_panchayat_id')
    panchayat = models.ForeignKey('PanchayatDetails', on_delete=models.CASCADE, null=True, blank=True, db_column='panchayat_id')
    village_street = models.ForeignKey('VillageStreetDetails', on_delete=models.CASCADE, null=True, blank=True, db_column='village_street_id')
    ward_number = models.CharField(max_length=50)
    address_line1 = models.CharField(max_length=100)
    street_name = models.CharField(max_length=100, blank=True, null=True)
    shop_num = models.CharField(max_length=20, blank=True, null=True)
    ref_number = models.CharField(max_length=20, blank=True, null=True)
    document_attachment = models.FileField(upload_to='attachments/', max_length=200, blank=True, null=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    registered_mobile = models.CharField(max_length=15)
    contact_mobile = models.CharField(max_length=15, blank=True, null=True)
    email_id = models.CharField(max_length=50)
    amount = models.TextField()  # This field type is a guess.
    status = models.CharField(max_length=50, blank=True, null=True)
    created_by = models.CharField(max_length=50, blank=True, null=True)
    created_date = models.CharField(max_length=50, blank=True, null=True)
    updated_by = models.CharField(max_length=50, blank=True, null=True)
    updated_date = models.CharField(max_length=50, blank=True, null=True)
    approved_by = models.CharField(max_length=50, blank=True, null=True)
    approved_date = models.CharField(max_length=50, blank=True, null=True)
    constituency = models.ForeignKey('ElectionConstituencyDetails',on_delete=models.SET_NULL,null=True,blank=True,default=91,related_name='service_requests')
    class Meta:
        managed = True
        db_table = 'service_request_details'