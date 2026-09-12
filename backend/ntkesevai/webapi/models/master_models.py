from django.db import models

# Create your models here.
class ElectionConstituencyDetails(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=100, blank=True, null=True)
    class Meta:
        managed = True
        db_table = 'election_constituency'

class DistrictDetails(models.Model):
    district_id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'district_details'

# Create your models here.
class BlockDetails(models.Model):
    block_id = models.IntegerField(primary_key=True)
    districtDetails = models.ForeignKey(DistrictDetails, on_delete=models.CASCADE, db_column='district_id')
    name = models.CharField(max_length=50, blank=True, null=True)
    # Link blocks to their respective constituencies
    constituency = models.ForeignKey('ElectionConstituencyDetails', on_delete=models.SET_NULL, null=True, blank=True,
                                     default=91, related_name='ElectionConstituencyDetails')

    class Meta:
        managed = True
        db_table = 'block_details'

    def __str__(self):
        return f"Block details {self.block_id}"

class TownPanchayatDetails(models.Model):
    town_panchayat_id = models.IntegerField(primary_key=True)
    blockDetails = models.ForeignKey(BlockDetails, on_delete=models.CASCADE, db_column='block_id')
    name = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'town_panchayat_details'

    def __str__(self):
        return f"Town Panchayat details {self.town_panchayat_id}"

class PanchayatDetails(models.Model):
    id = models.IntegerField(primary_key=True)
    blockDetails = models.ForeignKey(BlockDetails, on_delete=models.CASCADE, db_column='block_id')
    name = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'panchayat_details'

    def __str__(self):
        return f"Panchayat details {self.id}"

class RevenueVillageDetails(models.Model):
    village_id = models.IntegerField(primary_key=True)
    blockDetails = models.ForeignKey(BlockDetails, on_delete=models.CASCADE, db_column='block_id')
    townPanchayatDetails = models.ForeignKey(TownPanchayatDetails, on_delete=models.CASCADE, db_column='town_panchayat_id', null=True, blank=True)
    panchayatDetails = models.ForeignKey(PanchayatDetails, on_delete=models.CASCADE, db_column='panchayat_id', null=True, blank=True)
    name = models.CharField(max_length=100)
    class Meta:
        managed = True
        db_table = 'revenue_village_details'
    
    def __str__(self):
        return f"Revenue village details {self.village_id}"

class VillageStreetDetails(models.Model):
    id = models.SmallIntegerField(primary_key=True)
    ward = models.BigIntegerField(blank=True, null=True)
    village_street_name = models.CharField(max_length=100, blank=True, null=True)
    population = models.BigIntegerField(blank=True, null=True)
    town_panchayat_id = models.BigIntegerField(blank=True, null=True)
    village_panchayat_id = models.BigIntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'village_street_details'
    def __str__(self):
        return f"Village street details {self.id}"

class HomePageDetails(models.Model):
    id = models.SmallIntegerField(primary_key=True)
    heading = models.CharField(100)
    sub_heading = models.CharField(100)
    content = models.CharField(1000)
    url = models.CharField(100)
    type = models.CharField(20)

    class Meta:
        managed = True
        db_table = 'homepage_details'

class SocialMediaDetails(models.Model):
    id = models.SmallIntegerField(primary_key=True)
    medianame = models.TextField(100)
    logo_url = models.TextField(100)
    url = models.TextField(100)

    class Meta:
        managed = True
        db_table = 'social_media_details'

class ContactDetails(models.Model):
    id = models.SmallIntegerField(primary_key=True)
    heading = models.TextField(100)
    title = models.TextField(10)
    firstname = models.TextField(100)
    lastname = models.TextField(100)
    address1 = models.TextField(100)
    address2 = models.TextField(100)
    address3 = models.TextField(100)
    url = models.TextField(100)
    emailid = models.TextField(100)
    mobile = models.TextField(20)
    subject = models.TextField(100)
    query = models.TextField(1000)
    contact_type = models.TextField(20)

    class Meta:
        managed = True
        db_table = 'contact_details'