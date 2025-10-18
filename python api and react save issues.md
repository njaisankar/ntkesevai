We have created python API with below master models DistrictDetails and BlockDetails and those models used as foreign key in ServiceRequestDetails, same way created serializer and viewsets with modelviewset for Create, Read, Update and Delete.

Displayed in react grid and on click on the row action edit or delete and provided create in top of the grid. Earlier it was working fine all the CRUD operations as directly  passed as formdata including district_Id, block_id.

After modified little bit to show district and block name instead of Id modified in get/list method passing master  json data for district and block details and displayed in the grid as district.name and block.name.

Now when user create new record, user assigned district_id, block_id passing other required data as formdata to API always coming as null for these key columns.

so when user clicks on Save button all the values coming except district_id and block_id, i believe that there is a mapping issue some where in the view set. 

Can you please correct / fix the issues. 


Model details
# Create your models here.
class DistrictDetails(models.Model):
    district_id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'district_details'

# Create your models here.
class BlockDetails(models.Model):
    block_id = models.IntegerField(primary_key=True)
    districtDetails = models.ForeignKey(DistrictDetails, on_delete=models.CASCADE, db_column='district_id')
    name = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'block_details'


class ServiceRequestDetails(models.Model):
    id = models.BigAutoField(primary_key=True)
    service_id = models.BigIntegerField()
    service_details = models.ForeignKey('ServiceDetails', on_delete=models.CASCADE, null=True, blank=True)
    district = models.ForeignKey('DistrictDetails', on_delete=models.CASCADE)
    block = models.ForeignKey('BlockDetails', on_delete=models.CASCADE, null=True, blank=True)
    town_panchayat = models.ForeignKey('TownPanchayatDetails', on_delete=models.CASCADE, null=True, blank=True)
    panchayat = models.ForeignKey('PanchayatDetails', on_delete=models.CASCADE, null=True, blank=True)
    village_street = models.ForeignKey('VillageStreetDetails', on_delete=models.CASCADE, null=True, blank=True)
    ward_number = models.CharField(max_length=50)
    address_line1 = models.CharField(max_length=100)
    street_name = models.CharField(max_length=100)
    shop_num = models.CharField(max_length=20, blank=True, null=True)
    ref_number = models.CharField(max_length=20, blank=True, null=True)
    document_attachment = models.FileField(upload_to='media/', max_length=200, blank=True, null=True)
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


Serializer
------------
class ServiceRequestListSerializer(serializers.ModelSerializer):
    district = DistrictSerializer(read_only=True)
    block = BlockSerializer(read_only=True)
    town_panchayat = TownPanchayatSerializer(read_only=True)
    panchayat = PanchayatSerializer(read_only=True)
    village_street = TownPanchayatVillageSerializer(read_only=True)
    class Meta:
        model = ServiceRequestDetails
        fields = '__all__'


viewset
---------
class ServiceRequestViewSet(viewsets.ModelViewSet):
    queryset = ServiceRequestDetails.objects.all()
    print('edit ', queryset)
    serializer_class = ServiceRequestSerializer
    pagination_class = CustomPagination
    # 💡 This is the critical line you are missing.
    # It tells the viewset to accept both multipart and form data for all methods.
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        queryset = super().get_queryset()
        serviceId = self.request.query_params.get('serviceid')
        print('Service Id =>', serviceId)
        queryset = queryset.filter(service_id=serviceId);
        return queryset.select_related('service_details','district','block','town_panchayat','panchayat', 'village_street' )
    
    def list(self, request, *args, **kwargs):



