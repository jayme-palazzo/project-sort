import LocationSelect from '../components/LocationSelect';

function EditItemScreen() {
  const [item, setItem] = useState({
    name: '',
    quantity: '',
    price: '',
    category: '',
    location: '', // This will now store the location ID
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate form data
      if (!item.name || !item.quantity || !item.price || !item.category) {
        setError('Please fill in all required fields');
        return;
      }

      // Convert quantity and price to numbers
      const itemData = {
        ...item,
        quantity: Number(item.quantity),
        price: Number(item.price),
      };

      await InventoryService.updateItem(id, itemData);
      navigate('/inventory');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Item
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Name"
              value={item.name}
              onChange={(e) => setItem({ ...item, name: e.target.value })}
              required
              fullWidth
            />
            <TextField
              label="Quantity"
              type="number"
              value={item.quantity}
              onChange={(e) => setItem({ ...item, quantity: e.target.value })}
              required
              fullWidth
            />
            <TextField
              label="Price"
              type="number"
              value={item.price}
              onChange={(e) => setItem({ ...item, price: e.target.value })}
              required
              fullWidth
            />
            <CategorySelect
              value={item.category}
              onChange={(value) => setItem({ ...item, category: value })}
            />
            <LocationSelect
              value={item.location}
              onChange={(value) => setItem({ ...item, location: value })}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Update Item
            </Button>
          </Box>
        </form>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
    </Container>
  );
} 