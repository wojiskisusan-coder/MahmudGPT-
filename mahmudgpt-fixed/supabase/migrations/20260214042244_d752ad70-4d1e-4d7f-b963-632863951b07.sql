
-- Create referral_codes table
CREATE TABLE public.referral_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  is_used BOOLEAN NOT NULL DEFAULT false,
  used_by UUID REFERENCES auth.users(id),
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;

-- Anyone can read codes to check validity
CREATE POLICY "Anyone can check referral codes"
ON public.referral_codes
FOR SELECT
USING (true);

-- Only authenticated users can update (redeem) codes
CREATE POLICY "Authenticated users can redeem codes"
ON public.referral_codes
FOR UPDATE
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Insert all referral codes
INSERT INTO public.referral_codes (code) VALUES
('RF7KX2A9'),('NX4PZ8Q1'),('LM9TR6V2'),('JK3WY8H5'),('QZ7MN2L8'),
('TP4XK9R6'),('BD8QW2F7'),('CY5LR9T1'),('HZ2MK8P4'),('VX7QD3N9'),
('WR6TB2K8'),('PL9XH4C7'),('DS8QJ1M5'),('GF2ZK9L4'),('MT7RV3X8'),
('QN5YP2T6'),('AK9LZ4W7'),('RB3XM8Q2'),('UH6KT9P1'),('CV4NR7L8'),
('YE8QK2D5'),('IJ3TP9X4'),('LK7MW2R6'),('OP5ZQ8N3'),('ST9HX4C2'),
('UV6RK1P8'),('WX2LM9T7'),('ZA8QJ3K5'),('BC4NP7R9'),('DE7XM2L8'),
('FG9TR5Q1'),('HI2ZK8P4'),('JK6LW9R3'),('MN3XP7Q2'),('OP8RT4K6'),
('QR5ZL9M1'),('ST2NK8P7'),('UV9XM3R4'),('WX6QT1L8'),('YZ4KR7P2'),
('AB8NX5Q9'),('CD3ZL7T4'),('EF9RK2M6'),('GH5XP8Q1'),('IJ7NT4L9'),
('KL2ZR8P3'),('MN6QX1R7'),('OP4LK9T2'),('QR8NM3P5'),('ST1XZ7R4'),
('UV5LK8Q2'),('WX9RT3M6'),('YZ2NP7K8'),('AC6QX4R9'),('BD8ZL1T5'),
('CE3RP9K7'),('DF7XN2Q4'),('EG9LK5R8'),('FH2ZT8P6'),('GI4QX7M1'),
('HJ6RN9L3'),('IK8XP2T4'),('JL5ZQ7R9'),('KM3NT8L2'),('LN9RX4P6'),
('MO2ZK7Q8'),('NP6LT1R5'),('OQ8XM3K7'),('PR4ZQ9N2'),('QS7LK5T8'),
('RT1XP6R4'),('SU9QK2M7'),('TV3ZN8L5'),('UW6RX1P9'),('VX2QL7K4'),
('WY8ZT3R6'),('XZ5NP9L2'),('YA4QK7M8'),('ZB6XR1T9'),('AC9LP4R7'),
('BD2ZK8Q5'),('CE7RN3L9'),('DF5XT1P8'),('EG8QL4K2'),('FH3ZR9M6'),
('GI7NP2T4'),('HJ9RX5L8'),('IK4ZQ7P1'),('JL6XN8R3'),('KM2LT9Q7'),
('LN8RP4K5'),('MO5ZX1T6'),('NP7QL3R8'),('OQ9KT2M4'),('PR6XN5L7'),
('QS3ZP8R2'),('RT8QL1K9');
